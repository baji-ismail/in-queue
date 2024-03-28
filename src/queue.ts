class Queue<T> {
  private maxsize: number;
  private isClear: boolean;
  private items: T[];
  private waiting: (() => void)[];
  private waitingPush: (() => void)[];
  private eventListeners: { [event: string]: Function[] };

  async *[Symbol.asyncIterator](): AsyncIterableIterator<T> {
    let queue = this;
    while (true) {
      yield await queue.get();
    }
  }

  constructor({ maxsize = 0 }: { maxsize?: number } = {}) {
    this.maxsize = maxsize;
    this.items = [];
    this.waiting = [];
    this.waitingPush = [];
    this.isClear = false;
    this.eventListeners = {};
  }

  async get(timeout?: number): Promise<T> {
    if (this.isEmpty()) {
      try {
        await new Promise<void>((resolve, reject) => {
          this.waiting.push(resolve);
          if (timeout) {
            setTimeout(() => {
              this.waiting = this.waiting.filter(
                (oneResolve) => oneResolve != resolve
              );
              reject("timeout");
            }, timeout);
          }
        });
      } catch {
        throw new Error("Timeout");
      }
    }
    const value = this.items.shift()!;
    if (this.waitingPush.length > 0) {
      const resolve = this.waitingPush.shift()!;
      resolve();
    }
    this.emit("itemRemoved", value);
    if (this.isEmpty()) this.emit("empty");
    return value;
  }

  get_nowait(): T | undefined {
    const value = this.items.shift();
    if (value) this.emit("itemRemoved", value);
    if (value && this.isEmpty()) this.emit("empty");
    return value;
  }

  async getBatch(count: number = 1): Promise<T[]> {
    const values: T[] = [];
    while (values.length < count) {
      const item = await this.get();
      values.push(item);
    }
    this.emit("itemsRemoved", values);
    return values;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  async push(item: T, timeout?: number): Promise<void> {
    if (this.isFull()) {
      try {
        await new Promise<void>((resolve, reject) => {
          this.waitingPush.push(resolve);

          if (timeout) {
            setTimeout(() => {
              this.waitingPush = this.waitingPush.filter(
                (oneResolve) => oneResolve != resolve
              );
              reject("timeout");
            }, timeout);
          }
        });
      } catch {
        throw new Error("Timeout");
      }
    }
    if (this.isClear) throw new Error("ValuesHasClear");
    this.items.push(item);
    if (this.isFull()) this.emit("full");
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve();
    }
    this.emit("itemPushed", item);
  }

  push_nowait(item: T): void {
    if (this.isFull()) throw new Error("QueueFull");
    this.push(item);
    if (this.isFull()) this.emit("full");
    this.emit("itemPushed", item);
  }

  async pushBatch(values: T[]): Promise<void> {
    for (const value of values) {
      await this.push(value);
    }
    this.emit("itemsPushed", values);
  }

  isEmpty(): boolean {
    return this.qsize() === 0;
  }

  isFull(): boolean {
    if (!this.maxsize) return false;
    return this.qsize() >= this.maxsize;
  }

  clear() {
    this.isClear = true;
    for (let index = 0; index < this.waitingPush.length; index++) {
      const resolve = this.waitingPush.shift()!;
      resolve();
    }
    this.items = [];
    this.isClear = false;
    this.emit("queueCleared");
  }

  qsize(): number {
    return this.items.length;
  }

  setSize(newSize: number, forceResize = false, truncateItems = false): void {
    if (!forceResize && newSize < this.qsize()) throw new Error("SizeError");
    if (truncateItems) this.items = this.items.slice(0, newSize);
    this.maxsize = newSize;
    this.emit("sizeChanged");
  }

  on(event: string, listener: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((listener) => listener(...args));
    }
  }
}

export default Queue;

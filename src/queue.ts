class Queue<T> {
  private maxsize: number;
  private isClear: boolean;
  private items: T[];
  private waiting: (() => void)[];
  private waitingPush: (() => void)[];

  constructor({ maxsize = 0 }: { maxsize?: number } = {}) {
    this.maxsize = maxsize;
    this.items = [];
    this.waiting = [];
    this.waitingPush = [];
    this.isClear = false;
  }

  async get(): Promise<T> {
    if (this.isEmpty()) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    const value = this.items.shift()!;
    if (this.waitingPush.length > 0) {
      const resolve = this.waitingPush.shift()!;
      resolve();
    }
    return value;
  }

  get_nowait(): T | undefined {
    return this.items.shift();
  }

  peek():T | undefined{
    return this.items[0];
  }
  
  async push(item: T): Promise<void> {
    if (this.isFull()) {
      await new Promise<void>((resolve) => this.waitingPush.push(resolve))
    }
    if(this.isClear) throw new Error("ValuesHasClear")
    this.items.push(item);
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve();
    }
  }

  push_nowait(item: T): void {
    if (this.isFull()) {
      throw new Error("QueueFull");
    }
    this.push(item);
  }

  isEmpty(): boolean {
    return this.qsize() === 0;
  }

  isFull(): boolean {
    if (!this.maxsize) return false;
    return this.qsize() >= this.maxsize;
  }

  clear(){
    this.isClear = true
    for (let index = 0; index < this.waitingPush.length; index++) {
      const resolve = this.waitingPush.shift()!;
      resolve()
    }
    this.items = []
    this.isClear = false
  }

  qsize(): number {
    return this.items.length;
  }

  setSize(newSize: number, forceResize = false, truncateItems = false): void {
    if (!forceResize && newSize < this.qsize()) throw new Error("SizeError");
    if (truncateItems) this.items = this.items.slice(0, newSize);
    this.maxsize = newSize;
  }
}

export default Queue;

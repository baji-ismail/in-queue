var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
/**
 * Represents a queue data structure that follows the First In First Out (FIFO) principle.
 * @template T The type of elements stored in the queue.
 */
class Queue {
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            while (true) {
                yield yield __await(yield __await(this.get()));
            }
        });
    }
    /**
     * Creates an instance of Queue.
     * @param {Object} [options] The options for configuring the queue.
     * @param {number} [options.maxsize=0] The maximum size of the queue. Use 0 for unlimited size.
     * @param {"FIFO" | "LIFO"} [options.queueType="FIFO"] - The type of queue: "FIFO" for First In First Out or "LIFO" for Last In First Out.
     */
    constructor({ maxsize = 0, queueType = "FIFO", } = {}) {
        this.queueType = "FIFO";
        this.isClear = false;
        this.items = [];
        this.waiting = [];
        this.waitingPush = [];
        this.eventListeners = {};
        this.maxsize = maxsize;
        this.queueType = queueType;
    }
    /**
     * Removes and returns an item from the queue.
     * If the queue is empty, it will wait until an item is available.
     * If a timeout value is provided and the item is not available within the specified time, it will throw a "Timeout" error.
     * @param {number} [timeout] The maximum time to wait for an item to become available (in milliseconds).
     * @returns {Promise<T>} A promise that resolves with the next item in the queue when available.
     * @throws {Error} If the queue is empty and the timeout is reached.
     */
    get(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmpty()) {
                try {
                    yield new Promise((resolve, reject) => {
                        this.waiting.push(resolve);
                        if (timeout) {
                            setTimeout(() => {
                                this.waiting = this.waiting.filter((oneResolve) => oneResolve != resolve);
                                reject("timeout");
                            }, timeout);
                        }
                    });
                }
                catch (_a) {
                    throw new Error("Timeout");
                }
            }
            const value = this.items.shift();
            if (this.waitingPush.length > 0) {
                const resolve = this.waitingPush.shift();
                resolve();
            }
            this.emit("itemRemoved", value);
            if (this.isEmpty())
                this.emit("empty");
            return value;
        });
    }
    /**
     * Removes and returns an item from the queue if the queue is not empty.
     * If the queue is empty, it returns undefined.
     * @returns {T | undefined} The next item in the queue, or undefined if the queue is empty.
     */
    get_nowait() {
        const value = this.items.shift();
        if (this.waitingPush.length > 0) {
            const resolve = this.waitingPush.shift();
            resolve();
        }
        if (value)
            this.emit("itemRemoved", value);
        if (value && this.isEmpty())
            this.emit("empty");
        return value;
    }
    /**
     * Removes and returns a batch of items from the queue.
     * If the queue does not have enough items to form a full batch, it will wait until enough items are available.
     * @param {number} [count=1] The number of items to retrieve in the batch.
     * @returns {Promise<T[]>} A promise that resolves with an array of items from the queue.
     */
    getBatch() {
        return __awaiter(this, arguments, void 0, function* (count = 1) {
            const values = [];
            while (values.length < count) {
                const item = yield this.get();
                values.push(item);
            }
            this.emit("itemsRemoved", values);
            return values;
        });
    }
    /**
     * Returns the next item in the queue without removing it.
     * If the queue is empty, it returns undefined.
     * @returns {T | undefined} The next item in the queue, or undefined if the queue is empty.
     */
    peek() {
        return this.items[0];
    }
    /**
     * Adds an item to the queue.
     * If the queue is full, it will wait until a slot is available.
     * If a timeout value is provided and the queue remains full for longer than the specified time, it will throw a "Timeout" error.
     * @param {T} item The item to add to the queue.
     * @param {number} [timeout] The maximum time to wait for a slot to become available (in milliseconds).
     * @returns {Promise<void>} A promise that resolves when the item is successfully added to the queue.
     * @throws {Error} If the queue is full and the timeout is reached.
     * @throws {Error} If the queue has been cleared using the `clear` method.
     */
    push(item, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFull()) {
                try {
                    yield new Promise((resolve, reject) => {
                        this.waitingPush.push(resolve);
                        if (timeout) {
                            setTimeout(() => {
                                this.waitingPush = this.waitingPush.filter((oneResolve) => oneResolve != resolve);
                                reject("timeout");
                            }, timeout);
                        }
                    });
                }
                catch (_a) {
                    throw new Error("Timeout");
                }
            }
            if (this.isClear)
                throw new Error("ValuesHasClear");
            if (this.queueType == "FIFO")
                this.items.push(item);
            else
                this.items.unshift(item);
            if (this.isFull())
                this.emit("full");
            if (this.waiting.length > 0) {
                const resolve = this.waiting.shift();
                resolve();
            }
            this.emit("itemPushed", item);
        });
    }
    /**
     * Adds an item to the queue without waiting.
     * If the queue is full, it throws an error.
     * @param {T} item The item to add to the queue.
     * @throws {Error} If the queue is full.
     */
    push_nowait(item) {
        if (this.isFull())
            throw new Error("QueueFull");
        if (this.queueType == "FIFO")
            this.items.push(item);
        else
            this.items.unshift(item);
        if (this.isFull())
            this.emit("full");
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve();
        }
        this.emit("itemPushed", item);
    }
    /**
     * Adds an array of items to the queue.
     * If the queue is full, it will wait until slots are available.
     * @param {T[]} values The array of items to add to the queue.
     * @returns {Promise<void>} A promise that resolves when all items are successfully added to the queue.
     */
    pushBatch(values) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const value of values) {
                yield this.push(value);
            }
            this.emit("itemsPushed", values);
        });
    }
    /**
     * Checks if the queue is empty.
     * @returns {boolean} true if the queue is empty, false otherwise.
     */
    isEmpty() {
        return this.qsize() === 0;
    }
    /**
     * Checks if the queue is full.
     * @returns {boolean} true if the queue is full, false otherwise.
     */
    isFull() {
        if (!this.maxsize)
            return false;
        return this.qsize() >= this.maxsize;
    }
    /**
     * Removes all items from the queue and resets the queue to its initial state.
     * Emits a "queueCleared" event after clearing the queue.
     */
    clear() {
        this.isClear = true;
        for (let index = 0; index < this.waitingPush.length; index++) {
            const resolve = this.waitingPush.shift();
            resolve();
        }
        this.items = [];
        this.isClear = false;
        this.emit("queueCleared");
    }
    /**
     * Returns the number of items in the queue.
     * @returns {number} The number of items in the queue.
     */
    qsize() {
        return this.items.length;
    }
    /**
     * Changes the maximum size of the queue.
     * @param {number} newSize The new maximum size of the queue.
     * @param {boolean} [forceResize=false] If true, the queue will be resized even if newSize is smaller than the current queue size.
     * @param {boolean} [truncateItems=false] If true, items will be removed from the queue if newSize is smaller than the current queue size.
     * @throws {Error} If forceResize is false and newSize is smaller than the current number of items in the queue.
     */
    setSize(newSize, forceResize, truncateItems) {
        if (!forceResize && newSize < this.qsize())
            throw new Error("SizeError");
        if (truncateItems)
            this.items = this.items.slice(0, newSize);
        this.maxsize = newSize;
        this.emit("sizeChanged");
    }
    /**
     * Registers an event listener for the specified event.
     * When the event is emitted, the listener function will be called with the emitted arguments.
     *
     * @param {string} event The name of the event to listen for.
     * @param {Function} listener The listener function to call when the event is emitted.
     *
     * @event itemRemoved Emitted when an item is removed from the queue.
     * @event itemsRemoved Emitted when multiple items are removed from the queue.
     * @event itemPushed Emitted when an item is pushed to the queue.
     * @event itemsPushed Emitted when multiple items are pushed to the queue.
     * @event sizeChanged Emitted when the maximum size of the queue is changed.
     * @event queueCleared Emitted when all items are removed from the queue, clearing it.
     * @event full Emitted when the queue becomes full.
     * @event empty Emitted when the queue becomes empty.
     */
    on(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    }
    /**
     * Emits an event, calling all registered listeners for that event with the provided arguments.
     *
     * @param {string} event The name of the event to emit.
     * @param {...any} args The arguments to pass to the event listeners.
     */
    emit(event, args) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((listener) => listener(args));
        }
    }
}
export default Queue;

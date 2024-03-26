var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Queue {
    constructor({ maxsize = 0 } = {}) {
        this.maxsize = maxsize;
        this.items = [];
        this.waiting = [];
        this.waitingPush = [];
        this.isClear = false;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmpty()) {
                yield new Promise((resolve) => this.waiting.push(resolve));
            }
            const value = this.items.shift();
            if (this.waitingPush.length > 0) {
                const resolve = this.waitingPush.shift();
                resolve();
            }
            return value;
        });
    }
    get_nowait() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    push(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFull()) {
                yield new Promise((resolve) => this.waitingPush.push(resolve));
            }
            if (this.isClear)
                throw new Error("ValuesHasClear");
            this.items.push(item);
            if (this.waiting.length > 0) {
                const resolve = this.waiting.shift();
                resolve();
            }
        });
    }
    push_nowait(item) {
        if (this.isFull()) {
            throw new Error("QueueFull");
        }
        this.push(item);
    }
    isEmpty() {
        return this.qsize() === 0;
    }
    isFull() {
        if (!this.maxsize)
            return false;
        return this.qsize() >= this.maxsize;
    }
    clear() {
        this.isClear = true;
        for (let index = 0; index < this.waitingPush.length; index++) {
            const resolve = this.waitingPush.shift();
            resolve();
        }
        this.items = [];
        this.isClear = false;
    }
    qsize() {
        return this.items.length;
    }
    setSize(newSize, forceResize = false, truncateItems = false) {
        if (!forceResize && newSize < this.qsize())
            throw new Error("SizeError");
        if (truncateItems)
            this.items = this.items.slice(0, newSize);
        this.maxsize = newSize;
    }
}
export default Queue;

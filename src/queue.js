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
class Queue {
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            let queue = this;
            while (true) {
                yield yield __await(yield __await(queue.get()));
            }
        });
    }
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

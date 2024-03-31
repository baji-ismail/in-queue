# IN QUEUE

Like a stack, the queue is a linear data structure that stores items in either a First In First Out (FIFO) or Last In First Out (LIFO) manner. With FIFO, the least recently added item is removed first, while with LIFO, the most recently added item is removed first. A good example of a FIFO queue is any queue of consumers for a resource where the consumer that came first is served first.

<div align="center">

![Logo](https://raw.githubusercontent.com/baji-ismail/in-queue/main/img.png)

</div>

<div align="center">

[![CI](https://github.com/baji-ismail/in-queue/actions/workflows/ci.yml/badge.svg)](https://github.com/baji-ismail/in-queue/actions/workflows/ci.yml) [![version](https://img.shields.io/npm/v/in-queue.svg)](https://www.npmjs.com/package/in-queue) [![in-queue downloads](https://img.shields.io/npm/dm/in-queue.svg?label=npm%20i%20in-queue)](https://npm-stat.com/charts.html?package=in-queue&package=in-queue-pure&package=in-queue-compat&from=2014-11-18)

</div>

## Installation

You can install the package using npm or yarn:

```sh
npm install in-queue
# or
yarn add in-queue
```

## Usage/Examples

```javascript
import Queue from "in-queue";

// Create a new queue with a maximum size of 3
const queue = new Queue({ maxsize: 3 });

// Asynchronously append items to the queue
async function append(number) {
  await queue.push(number);
  console.log(`Successfully appended ${number}`);
}

// Append items to the queue
append(1); // Output: Successfully appended 1
append(2); // Output: Successfully appended 2

// Get number of items in the queue.
console.log(queue.qsize()); // Output: 2

// Append items to the queue
append(3); // Output: Successfully appended 3

console.log(queue.qsize()); // Output: 3

// Append items to the queue
append(4); // Queue is full, will wait until a slot is available

// Get number of items in the queue.
console.log(queue.qsize()); // Output: 3

// Pop items from the queue
const item1 = await queue.get(); // Output: Successfully appended 4
const item2 = await queue.get();
const item3 = await queue.get();
const item4 = await queue.get();

console.log(item1, item2, item3, item4); // Output: 1 2 3 4
```

## Docs

- **Queue** -

  - maxsize (optional, default: 0) - The maximum size of the queue. Use 0 for unlimited size.
  - queueType (optional, default: "FIFO") - The type of queue. Can be either "FIFO" for First In First Out or "LIFO" for Last In First Out.

  ```javascript
  import Queue from "in-queue";

  // Create a new FIFO queue with a maximum size of 3
  const fifoQueue = new Queue({ maxsize: 3 });

  // Create a new LIFO queue with a maximum size of 5
  const lifoQueue = new Queue({ maxsize: 5, queueType: "LIFO" });
  ```

This class provides methods for adding and removing items from the queue, checking if the queue is empty or full, getting the size of the queue, and more. It can be used to manage a collection of items in either a FIFO or LIFO fashion, depending on the specified queueType.

- **push(item,timeout?: number)** - Adds an item to the queue. If the queue is full, it will wait until a slot is available. If a timeout value (in milliseconds) is provided and the queue remains full for longer than the specified time, it will throw a "Timeout" error.

  ```javascript
  // Append items to the queue without timeout
  async function appendWithoutTimeout(item) {
    await queue.push(item);
    console.log(`Successfully appended ${item}`);
  }

  // Usage
  appendWithoutTimeout(1); // Output: Successfully appended 1
  ```

  ***

  ```javascript
  // Append items to the queue with timeout
  async function appendWithTimeout(item) {
    try {
      await queue.push(item, 2000); // Wait for 2 seconds
      console.log(`Successfully appended ${item}`);
    } catch (error) {
      console.error("Failed to append item due to timeout");
    }
  }

  // Usage
  appendWithTimeout(2); // Output: Successfully appended 2 (if queue is not full)
  ```

This method adds an item to the queue, waiting if the queue is currently full. If a timeout value is specified and the queue remains full for longer than the specified time, it will throw a "Timeout" error. It is useful for adding items to the queue in a synchronous manner, ensuring that the queue does not exceed its maximum size, and providing control over the maximum wait time.

- **push_nowait(item)** - Adds an item to the queue if the queue is not full. If the queue is full, it throws an error.

  ```javascript
  // Add an item to the queue without waiting
  try {
    queue.push_nowait(item);
    console.log(`Successfully added ${item}`);
  } catch (error) {
    console.error("Queue is full");
  }
  ```

  This method is useful when you want to add an item to the queue without waiting for a slot to become available. If the queue is full, it throws an error, allowing you to handle full queue conditions appropriately.

- **pushBatch(arrayValues)** - Adds an array of items to the queue. If the queue is full, it will wait until slots are available.

```typescript
// Push an array of items to the queue
async function pushItems(values: T[]) {
  await queue.pushBatch(values);
  console.log(`Successfully pushed ${values.length} items to the queue`);
}
pushItems([1, 2, 3, 4, 5]);
```

This explanation highlights that `pushBatch` allows you to push multiple items to the queue at once, and it will wait for space to become available if the queue is full.

- **get(timeout?: number)** - Removes and returns an item from the queue. If the queue is empty, it will wait until an item is available. If a timeout value (in milliseconds) is provided and the item is not available within the specified time, it will throw a "Timeout" error.

  ```javascript
  // Pop items from the queue without a timeout
  async function consume() {
    console.log("Waiting for an item from the queue...");
    const item = await queue.get(); // Wait indefinitely until an item is available
    console.log(`Got item: ${item}`);
  }
  ```

  ***

  ```javascript
  // Pop items from the queue with a timeout
  async function consume() {
    try {
      console.log("Waiting for an item from the queue...");
      const item = await queue.get(5000); // Wait for 5 seconds (5000 milliseconds)
      console.log(`Got item: ${item}`);
    } catch (error) {
      console.error("Timeout waiting for item from the queue");
    }
  }
  ```

This method removes and returns the next item from the queue, waiting if the queue is currently empty. If a timeout value is provided and the item is not available within the specified time, it throws a "Timeout" error. It is useful for consuming items from the queue with a maximum waiting time.

- **get_nowait()** - Removes and returns an item from the queue if the queue is not empty. If the queue is empty, it returns undefined.

  ```javascript
  // Remove an item from the queue without waiting
  const item = queue.get_nowait();
  if (item !== undefined) {
    console.log(`Got item: ${item}`);
  } else {
    console.log("Queue is empty");
  }
  ```

  This method is useful when you want to retrieve an item from the queue without waiting for it to become available. If the queue is empty, it returns undefined, allowing you to handle empty queue conditions appropriately.

- **getBatch(count = 1)** - Returns an array of items from the queue, waiting for items if necessary until the specified count of items is retrieved.

  ```javascript
  // Example usage of getBatch
  async function processBatch() {
    const batch = await queue.getBatch(3);
    console.log("Batch:", batch);
  }
  ```

  This method retrieves a batch of items from the queue, waiting for items if necessary, until the specified count of items is retrieved. It can be useful when you need to process items in batches rather than one by one.

- **async \*[Symbol.asyncIterator]()** - Returns an asynchronous iterable iterator that allows consuming items from the queue as they become available.

  ```javascript
  import Queue from "in-queue";
  // Sleep function to simulate asynchronous behavior
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Create a new Queue instance
  const queue = new Queue<number>();

  // Consumer function that consumes items from the queue
  async function consumer() {
    console.log("Consumer started and waiting for items in the queue");
    for await (const item of queue) {
      console.log("Consumed:", item);
    }
  }

  // Producer function that produces items and adds them to the queue
  async function producer() {
    for (let i = 0; i < 5; i++) {
      await queue.push(i);
      console.log("Produced:", i);
    }
  }

  // Start the consumer
  consumer();

  // Wait for 10 seconds (to give time for the consumer to start)
  await sleep(10000);

  // Start the producer
  producer();
  ```

  This method returns an asynchronous iterable iterator that can be used to consume items from the queue as they become available. It can be used with the for await...of loop to iterate over items in the queue.

- **peek()** - Returns the next item in the queue without removing it. If the queue is empty, it returns undefined.

  ```javascript
  // Peek at the next item in the queue
  const item = queue.peek();
  if (item !== undefined) {
    console.log(`Next item in queue: ${item}`);
  } else {
    console.log("Queue is empty");
  }
  ```

This method allows you to look at the next item in the queue without removing it. If the queue is empty, it returns undefined, indicating that the queue is empty.

- **setSize(newSize, forceResize = false, truncateItems = false)** - Changes the maximum size of the queue. If **forceResize** is false and the new size is smaller than the current number of items in the queue, it throws a "SizeError". If **truncateItems** is true, it removes items from the queue if the new size is smaller than the current queue size.

  ```javascript
  // Change the maximum size of the queue
  queue.setSize(5, true, true);
  ```

This method allows you to dynamically change the maximum size of the queue. If forceResize is true, the queue will be resized even if newSize is smaller than the current queue size. If truncateItems is true, items will be removed from the queue if newSize is smaller than the current queue size.

- **clear()** - Removes all items from the queue and resets the queue to its initial state.

  ```javascript
  // Clear all items from the queue
  queue.clear();
  ```

This method empties the queue, removing all items from it. After calling `clear()`, the queue will be empty and ready to accept new items.

- **isEmpty()** - Checks if the queue is empty.

  ```javascript
  // Check if the queue is empty
  const empty = queue.isEmpty();
  if (empty) {
    console.log("Queue is empty");
  } else {
    console.log("Queue is not empty");
  }
  ```

This method returns true if the queue is empty, and false otherwise. It can be used to check if the queue has any items in it.

- **isFull()** - Checks if the queue is full.

  ```javascript
  // Check if the queue is full
  const full = queue.isFull();
  if (full) {
    console.log("Queue is full");
  } else {
    console.log("Queue is not full");
  }
  ```

This method returns true if the queue is full (reached its maximum size), and false otherwise. It can be used to check if the queue has reached its capacity.

- **qsize()** - Returns the number of items in the queue.

  ```javascript
  // Get the number of items in the queue
  const size = queue.qsize();
  console.log(`Queue size: ${size}`);
  ```

This method returns the current number of items in the queue. It can be used to determine the size of the queue at any given moment.

- **on(event: string, listener: Function)** - Registers an event listener for the specified event. When the event is emitted, the listener function will be called with the emitted arguments.

  - `itemRemoved` - Emitted when an item is removed from the queue.

  ```javascript
  // Example usage of 'itemRemoved' event
  queue.on("itemRemoved", (item) => {
    console.log(`Item removed: ${item}`);
  });

  // Remove an item from the queue
  const removedItem = await queue.get();
  // The 'itemRemoved' event will be emitted with the removed item when the item is successfully removed from the queue.
  ```

  - `itemsRemoved` - Emitted when multiple items are removed from the queue using getBatch.

  ```javascript
  // Example usage of 'itemsRemoved' event
  queue.on("itemsRemoved", (items) => {
    console.log(`Items removed: ${items}`);
  });

  // Remove a batch of items from the queue
  const removedItems = await queue.getBatch(3);
  // The 'itemsRemoved' event will be emitted with the removed items when the items are successfully removed from the queue.
  ```

  - `itemPushed` - Emitted when an item is pushed to the queue.

  ```javascript
  // Example usage of 'itemPushed' event
  queue.on("itemPushed", (item) => {
    console.log(`Item pushed: ${item}`);
  });

  // Push an item to the queue
  await queue.push(42);
  // The 'itemPushed' event will be emitted with the pushed item when the item is successfully added to the queue.
  ```

  - `itemsPushed` - Emitted when multiple items are pushed to the queue.

  ```javascript
  // Example usage of 'itemsPushed' event
  queue.on("itemsPushed", (items) => {
    console.log(`Items pushed: ${items}`);
  });

  // Push multiple items to the queue
  await queue.pushBatch([1, 2, 3]);
  // The 'itemsPushed' event will be emitted with the pushed items when all items are successfully added to the queue.
  ```

  - `full ` - Emitted when the queue becomes full, i.e., when the number of items in the queue reaches its maximum size.

  ```javascript
  // Example usage of 'full' event
  queue.on("full", () => {
    console.log("Queue is full!");
  });

  // Assume a maximum size of 10 for this example
  queue.setSize(10); // Set the maximum size of the queue to 10

  // Push items to the queue until it becomes full
  for (let i = 0; i < 10; i++) {
    await queue.push(i);
  }
  // The 'full' event will be emitted when the queue reaches its maximum size.
  ```

  - `empty ` - Emitted when the queue becomes empty, i.e., when the last item is removed from the queue.

  ```javascript
  // Example usage of 'empty' event
  queue.on("empty", () => {
    console.log("Queue is empty!");
  });

  // Assume the queue is initially populated with items

  // Remove all items from the queue until it becomes empty
  while (!queue.isEmpty()) {
    await queue.get();
  }
  // The 'empty' event will be emitted when the last item is removed from the queue.
  ```

  - `queueCleared` - Emitted when all items are removed from the queue, clearing the queue.

  ```javascript
  // Example usage of 'queueCleared' event
  queue.on("queueCleared", () => {
    console.log(`Queue cleared`);
  });

  // Clear the queue
  queue.clear();
  // The 'queueCleared' event will be emitted when all items are successfully removed from the queue, clearing it.
  ```

  - `sizeChanged` - Emitted when the maximum size of the queue is changed using the setSize method.

  ```javascript
  // Example usage of 'sizeChanged' event
  queue.on("sizeChanged", () => {
    console.log(`Queue size changed`);
  });

  // Change the size of the queue
  queue.setSize(10);
  // The 'sizeChanged' event will be emitted when the size of the queue is successfully changed.
  ```

This method allows you to listen for specific events that occur in the queue, such as when an item is pushed or removed. The listener function can perform actions based on these events, providing a way to react to changes in the queue.

## Contributing

Contributions are welcome! To contribute to `in-queue`, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

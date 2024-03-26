
# SIMPLE QUEUE

Like a stack, the queue is a linear data structure that stores items in a First In First Out (FIFO) manner. With a queue, the least recently added item is removed first. A good example of a queue is any queue of consumers for a resource where the consumer that came first is served first.


![Logo](https://media.geeksforgeeks.org/wp-content/cdn-uploads/gq/2014/02/Queue.png)


## Usage/Examples

```javascript
import Queue from 'simple-queue';

// Create a new queue with a maximum size of 3
const queue = new Queue({ maxsize: 3 });

// Asynchronously append items to the queue
async function append(number) {
    await queue.push(number);
    console.log(`Successfully appended ${number}`);
}

// Append items to the queue
append(1);  // Output: Successfully appended 1
append(2);  // Output: Successfully appended 2

// Get number of items in the queue.
console.log(queue.qsize()) // Output: 2

// Append items to the queue
append(3);  // Output: Successfully appended 3

console.log(queue.qsize()) // Output: 3

// Append items to the queue
append(4);  // Queue is full, will wait until a slot is available

// Get number of items in the queue.
console.log(queue.qsize()) // Output: 3

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

    ```javascript
    import Queue from 'simple-queue';

    // Create a new queue with a maximum size of 3
    const queue = new Queue({ maxsize: 3 });
    ```

This class provides methods for adding and removing items from the queue, checking if the queue is empty or full, getting the size of the queue, and more. It can be used to manage a collection of items in a FIFO fashion, where the first item added is the first to be removed.

- **push(item)** - Adds an item to the queue. If the queue is full, it will wait until a slot is available.

    ```javascript
    // Append items to the queue
    async function append(item) {
        await queue.push(item);
        console.log(`Successfully appended ${item}`);
    }
    ```

This method adds an item to the queue, waiting if the queue is currently full. It is useful for adding items to the queue in a synchronous manner, ensuring that the queue does not exceed its maximum size.

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

- **get()** - Removes and returns an item from the queue. If the queue is empty, it will wait until an item is available.

    ```javascript
    // Pop items from the queue
    async function consume() {
        console.log("Waiting for an item from the queue...");
        const item = await queue.get();
        console.log(`Got item: ${item}`);
    }
    ```

This method removes and returns the next item from the queue, waiting if the queue is currently empty. It is useful for consuming items from the queue in a synchronous manner, ensuring that the queue is not accessed when empty.

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
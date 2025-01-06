# EventEmitter

[![npm version](https://img.shields.io/npm/v/@lilbunnyrabbit/event-emitter.svg)](https://www.npmjs.com/package/@lilbunnyrabbit/event-emitter)
[![npm downloads](https://img.shields.io/npm/dt/@lilbunnyrabbit/event-emitter.svg)](https://www.npmjs.com/package/@lilbunnyrabbit/event-emitter)

The `EventEmitter` class provides a powerful and flexible mechanism for managing and handling custom events,
similar in functionality to the standard [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget) interface found in web APIs.
This class allows for easy creation of event-driven architectures in [TypeScript](https://www.typescriptlang.org/) applications, enabling objects to publish events to which other parts of the application can subscribe. It's particularly beneficial in scenarios where you need to implement custom event logic or when working outside of environments where [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget) is not available or suitable.

With `EventEmitter`, you can define event types, emit events, and dynamically attach or detach event listeners,
all within a type-safe and intuitive API.

## Installation

To use this package in your project, run:

```sh
npm i @lilbunnyrabbit/event-emitter
```

## Usage

### Creating an `EventEmitter`

Start by creating an instance of the `EventEmitter` class.
You can define the types of events it will handle using a [TypeScript](https://www.typescriptlang.org/) interface.

```ts
type MyEvents = {
  data: string;
  loaded: void;
  error: Error;
}

const emitter = new EventEmitter<MyEvents>();
```

### Registering Event Listeners

To listen for events, use the `EventEmitter.on` method.
Define the event type and provide a callback function that will be executed when the event is emitted.

```ts
emitter.on("data", (data: string) => {
  console.log("Data", data);
});

emitter.on("loaded", function () {
  console.log(
    "Emitter loaded",
    this // EventEmitter<MyEvents>
  );
});

emitter.on("error", (error: Error) => {
  console.error(`Error: ${error.message}`);
});
```

#### Registering a Global Listener

If you want to listen for **all** events with a single callback, use `EventEmitter.onAll`. The listener function receives an object containing the event type and any associated data:

```ts
emitter.onAll((event: GlobalEvent<MyEvents>) => {
  console.log(`Global listener caught event of type "${String(event.type)}"`, event.data);
});
```

This is especially useful when you need to handle different event types in one centralized place.

### Removing Event Listeners

You can remove a specific event listener by using the `EventEmitter.off` method,
specifying the event type and the listener to remove.

```ts
const onError = (error: Error) => console.error(error);

emitter.on("error", onError);

// ...

emitter.off("error", onError);
```

#### Removing a Global Listener

To remove the callback you registered via `EventEmitter.onAll`, call `EventEmitter.offAll` with the same function:

```ts
const globalListener = (event: GlobalEvent<MyEvents>) => {
  console.log(`Event "${String(event.type)}"`, event.data);
};

emitter.onAll(globalListener);

// ...

emitter.offAll(globalListener);
```

#### Removing All Listeners

If you need to remove **all** listeners (both event-specific and global) at once, you can use the `clear` method:

```ts
emitter.clear(); // Removes all event listeners and global listeners
```

After calling `EventEmitter.clear`, no existing listeners will be triggered unless you re-register them.

### Emitting Events

Use the `EventEmitter.emit` method to trigger an event.
This will invoke all registered listeners for that event type.

```ts
emitter.emit("data", "Sample data");
emitter.emit("loaded");
emitter.emit("error", new Error("Oh no!"));
```

### Extending `EventEmitter`

For more specialized use cases, you can extend the `EventEmitter` class.
This allows you to create a custom event emitter with additional methods or properties tailored to specific needs.
When extending, you can still take full advantage of the type safety and event handling features of the base class.

```ts
type MyServiceEvents = {
  dataLoaded: string;
  error: Error;
}

// Extending the EventEmitter class
class MyService extends EventEmitter<MyServiceEvents> {
  // Custom method
  loadData() {
    try {
      // Load data and emit a `dataLoaded` event
      const data = "Sample Data";
      this.emit("dataLoaded", data);
    } catch (error) {
      // Emit an `error` event
      this.emit("error", error);
    }
  }
}

const service = new MyService();

service.on("dataLoaded", function (data) {
  console.log(
    `Data loaded: ${data}`,
    this // MyService
  );
});

service.on("error", (error) => console.error(`Error: ${error.message}`));

// Using the custom method
myEmitter.loadData();
```

In this example, `MyService` extends the `EventEmitter` class, adding a custom method `loadData`.
This method demonstrates how to `EventEmitter.emit` `dataLoaded` and `error` events,
integrating the event-emitting functionality into a more complex operation.

## Development

This section provides a guide for developers to set up the project environment and utilize various npm scripts defined in the project for efficient development and release processes.

### Setting Up

Clone the repository and install dependencies:

```sh
git clone https://github.com/lilBunnyRabbit/event-emitter.git
cd event-emitter
npm install
```

### NPM Scripts

The project includes several npm scripts to streamline common tasks such as building, testing, and cleaning up the project.

| Script              | Description                                                                                                                                                                                       | Command                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **`build`**         | Compiles the [TypeScript](https://www.typescriptlang.org/) source code to JavaScript, placing the output in the `dist` directory. Essential for preparing the package for publication or testing. | `npm run build`         |
| **`test`**          | Executes the test suite using [Jest](https://jestjs.io/). Crucial for ensuring that your code meets all defined tests and behaves as expected.                                                    | `npm test`              |
| **`clean`**         | Removes both the `dist` directory and the `node_modules` directory. Useful for resetting the project's state during development or before a fresh install.                                        | `npm run clean`         |
| **`changeset`**     | Manages versioning and changelog generation based on conventional commit messages. Helps prepare for a new release by determining which parts of the package need version updates.                | `npm run changeset`     |
| **`release`**       | Publishes the package to npm. Uses `changeset publish` to automatically update package versions and changelogs before publishing. Streamlines the release process.                                | `npm run release`       |
| **`generate:docs`** | Generates project documentation using [Typedoc](https://typedoc.org/). Facilitates the creation of comprehensive and accessible API documentation.                                                | `npm run generate:docs` |

These scripts are designed to facilitate the development process, from cleaning and building the project to running tests and releasing new versions. Feel free to use and customize them as needed for your development workflow.

## Contribution

Contributions are always welcome! For any enhancements or bug fixes, please open a pull request linked to the relevant issue. If there's no existing issue related to your contribution, feel free to create one.

## Support

Your support is greatly appreciated! If this package has been helpful, consider supporting by buying me a coffee.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/lilBunnyRabbit)

## License

MIT © Andraž Mesarič-Sirec
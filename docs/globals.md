# @lilbunnyrabbit/event-emitter

## Classes

### EventEmitter\<TEvents\>

Event emitter class capable of emitting and listening for typed events.
It enables the creation of a strongly-typed, custom event handling system.

#### Example

```ts
type MyEvents = {
  data: string;
  loaded: void;
  error: Error;
}

const emitter = new EventEmitter<MyEvents>();
```

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TEvents` *extends* `Record`\<`PropertyKey`, `unknown`\> | An object type mapping event names to their associated data types. Each key represents an event name, and its value represents the type of data associated with that event. |

#### Constructors

##### new EventEmitter()

```ts
new EventEmitter<TEvents>(): EventEmitter<TEvents>
```

###### Returns

[`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>

#### Methods

##### emit()

```ts
emit<TType>(type, ...data): this
```

Emits an event of a specific type, invoking all registered listeners for that event type with the provided data.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TType` *extends* `string` \| `number` \| `symbol` | Event type. |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | The identifier for the event type to emit. |
| ...`data` | `TEvents`\[`TType`\] *extends* `void` ? [] : [`TEvents`\[`TType`\]] | The data to pass to the event listeners. The type of this data is defined by the corresponding value in TEvents. |

###### Returns

`this`

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

```ts
emitter.emit("data", "Sample data");
emitter.emit("loaded");
emitter.emit("error", new Error("Oh no!"));
```

###### Defined in

event-emitter.ts:106

##### off()

```ts
off<TType>(type, listener): this
```

Removes a previously registered event listener for a specified event type.
Use this method to unregister listeners when they are no longer needed, preventing potential memory leaks.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TType` *extends* `string` \| `number` \| `symbol` | Event type. |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | The identifier for the event type from which to remove the listener. |
| `listener` | [`EventListener`](globals.md#eventlistenertevents-tdata-temitter)\<`TEvents`, `TEvents`\[`TType`\], [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>\> | The callback function to unregister. |

###### Returns

`this`

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

```ts
const onError = (error: Error) => console.error(error);

emitter.on("error", onError);

// ...

emitter.off("error", onError);
```

###### Defined in

event-emitter.ts:83

##### on()

```ts
on<TType>(type, listener): this
```

Adds an event listener for a specified event type.
This method allows you to specify which event you are interested in listening to
and to provide a callback function that will be executed whenever that event is emitted.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TType` *extends* `string` \| `number` \| `symbol` | Event type. |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | The identifier for the event type to listen for. |
| `listener` | [`EventListener`](globals.md#eventlistenertevents-tdata-temitter)\<`TEvents`, `TEvents`\[`TType`\], [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>\> | The callback function that will be called when the event is emitted. |

###### Returns

`this`

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

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

###### Defined in

event-emitter.ts:53

## Type Aliases

### EventListener()\<TEvents, TData, TEmitter\>

```ts
type EventListener<TEvents, TData, TEmitter>: (this, ...data) => void | Promise<void>;
```

Defines a function type for event listeners.
The context (`this`) within the listener function is bound to the instance of the [EventEmitter](globals.md#eventemittertevents).
This design allows for strongly typed event handling, based on the specified event types and their associated data.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TEvents` *extends* `Record`\<`PropertyKey`, `unknown`\> | An object type mapping event names to their associated data types. |
| `TData` | The type of data that the event listener expects to receive. Can be void if no data is passed with the event. |
| `TEmitter` *extends* [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\> | The specific type of the [EventEmitter](globals.md#eventemittertevents) instance to which the listener is bound. |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `TEmitter` |
| ...`data` | `TData` *extends* `void` ? [] : [`TData`] |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

types.ts:12

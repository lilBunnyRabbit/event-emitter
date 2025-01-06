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
| `TEvents` *extends* [`EventMap`](globals.md#eventmap) | An object type mapping event names to their associated data types. Each key represents an event name, and its value represents the type of data associated with that event. |

#### Constructors

##### new EventEmitter()

```ts
new EventEmitter<TEvents>(): EventEmitter<TEvents>
```

###### Returns

[`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>

#### Methods

##### clear()

```ts
clear(): EventEmitter<TEvents>
```

Removes all listeners for all event types, as well as all global listeners.

###### Returns

[`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

```ts
emitter.clear(); // No more event listeners remain
```

###### Defined in

[event-emitter.ts:181](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L181)

##### emit()

```ts
emit<TType>(type, ...data): this
```

Emits an event of a specific type, invoking all registered listeners for that event type with the provided data.
Also calls any global event listeners with a [GlobalEvent](globals.md#globaleventtevents) object.

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

[event-emitter.ts:153](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L153)

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

[event-emitter.ts:85](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L85)

##### offAll()

```ts
offAll(listener): EventEmitter<TEvents>
```

Removes a previously registered global event listener.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | [`GlobalEventListener`](globals.md#globaleventlistenertevents-temitter)\<`TEvents`, [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>\> | The global event listener to remove. |

###### Returns

[`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

```ts
const globalListener = (event: GlobalEvent<TEvents>) => {
  console.log(`Event of type ${String(event.type)} received`, event.data);
};

emitter.onAll(globalListener);

// ...

emitter.offAll(globalListener);
```

###### Defined in

[event-emitter.ts:131](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L131)

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

[event-emitter.ts:55](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L55)

##### onAll()

```ts
onAll(listener): EventEmitter<TEvents>
```

Adds a global event listener that is called for every emitted event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | [`GlobalEventListener`](globals.md#globaleventlistenertevents-temitter)\<`TEvents`, [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>\> | The global event listener to add. |

###### Returns

[`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\>

The [EventEmitter](globals.md#eventemittertevents) instance itself, allowing for method chaining.

###### Example

```ts
emitter.onAll((event: GlobalEvent<TEvents>) => {
  console.log(`Event of type ${String(event.type)} received`, event.data);
});
```

###### Defined in

[event-emitter.ts:106](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/event-emitter.ts#L106)

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
| `TEvents` *extends* [`EventMap`](globals.md#eventmap) | An object type mapping event names to their associated data types. |
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

[types.ts:14](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/types.ts#L14)

***

### EventMap

```ts
type EventMap: Record<PropertyKey, unknown>;
```

#### Defined in

[types.ts:3](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/types.ts#L3)

***

### GlobalEvent\<TEvents\>

```ts
type GlobalEvent<TEvents>: { [TType in keyof TEvents]: TEvents[TType] extends void ? { type: TType } : { data: TEvents[TType]; type: TType } }[keyof TEvents];
```

A discriminated union representing all possible emitted events,
containing the event type and the associated data if it exists.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TEvents` *extends* [`EventMap`](globals.md#eventmap) | An object type mapping event names to associated data types. |

#### Defined in

[types.ts:25](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/types.ts#L25)

***

### GlobalEventListener()\<TEvents, TEmitter\>

```ts
type GlobalEventListener<TEvents, TEmitter>: (this, event) => void | Promise<void>;
```

Defines a function type for global event listeners.
This listener is invoked for every event type emitted by the [EventEmitter](globals.md#eventemittertevents) instance.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TEvents` *extends* [`EventMap`](globals.md#eventmap) | An object type mapping event names to associated data types. |
| `TEmitter` *extends* [`EventEmitter`](globals.md#eventemittertevents)\<`TEvents`\> | The specific type of the [EventEmitter](globals.md#eventemittertevents) instance to which the listener is bound. |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `TEmitter` |
| `event` | [`GlobalEvent`](globals.md#globaleventtevents)\<`TEvents`\> |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[types.ts:36](https://github.com/lilBunnyRabbit/event-emitter/blob/cf71e7da61a159fd3c020e0a2404feb8790a26e1/src/types.ts#L36)

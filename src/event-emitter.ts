import { EventListener, EventMap, GlobalEvent, GlobalEventListener } from "./types";

/**
 * Event emitter class capable of emitting and listening for typed events.
 * It enables the creation of a strongly-typed, custom event handling system.
 *
 * @template TEvents - An object type mapping event names to their associated data types. Each key represents an event name, and its value represents the type of data associated with that event.
 *
 * @example
 * ```ts
 * type MyEvents = {
 *   data: string;
 *   loaded: void;
 *   error: Error;
 * }
 *
 * const emitter = new EventEmitter<MyEvents>();
 * ```
 */
export class EventEmitter<TEvents extends EventMap> {
  private listeners: Partial<{
    [TType in keyof TEvents]: Set<EventListener<TEvents, TEvents[TType], this>>;
  }> = {};

  private globalListeners: Set<GlobalEventListener<TEvents, this>> = new Set();

  /**
   * Adds an event listener for a specified event type.
   * This method allows you to specify which event you are interested in listening to
   * and to provide a callback function that will be executed whenever that event is emitted.
   *
   * @template TType - Event type.
   * @param type - The identifier for the event type to listen for.
   * @param listener - The callback function that will be called when the event is emitted.
   * @returns The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * emitter.on("data", (data: string) => {
   *   console.log("Data", data);
   * });
   *
   * emitter.on("loaded", function () {
   *   console.log(
   *     "Emitter loaded",
   *     this // EventEmitter<MyEvents>
   *   );
   * });
   *
   * emitter.on("error", (error: Error) => {
   *   console.error(`Error: ${error.message}`);
   * });
   * ```
   */
  public on<TType extends keyof TEvents>(type: TType, listener: EventListener<TEvents, TEvents[TType], this>): this {
    if (!(type in this.listeners)) {
      this.listeners[type] = new Set();
    }

    this.listeners[type]!.add(listener);

    return this;
  }

  /**
   * Removes a previously registered event listener for a specified event type.
   * Use this method to unregister listeners when they are no longer needed, preventing potential memory leaks.
   *
   * @template TType - Event type.
   * @param type - The identifier for the event type from which to remove the listener.
   * @param listener - The callback function to unregister.
   * @return The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * const onError = (error: Error) => console.error(error);
   *
   * emitter.on("error", onError);
   *
   * // ...
   *
   * emitter.off("error", onError);
   * ```
   */
  public off<TType extends keyof TEvents>(type: TType, listener: EventListener<TEvents, TEvents[TType], this>): this {
    if (this.listeners[type] !== undefined) {
      this.listeners[type]!.delete(listener);
    }

    return this;
  }

  /**
   * Adds a global event listener that is called for every emitted event.
   *
   * @param listener - The global event listener to add.
   * @returns The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * emitter.onAll((event: GlobalEvent<TEvents>) => {
   *   console.log(`Event of type ${String(event.type)} received`, event.data);
   * });
   * ```
   */
  public onAll(listener: GlobalEventListener<TEvents, this>) {
    this.globalListeners.add(listener);

    return this;
  }

  /**
   * Removes a previously registered global event listener.
   *
   * @param listener - The global event listener to remove.
   * @returns The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * const globalListener = (event: GlobalEvent<TEvents>) => {
   *   console.log(`Event of type ${String(event.type)} received`, event.data);
   * };
   *
   * emitter.onAll(globalListener);
   *
   * // ...
   *
   * emitter.offAll(globalListener);
   * ```
   */
  public offAll(listener: GlobalEventListener<TEvents, this>) {
    this.globalListeners.delete(listener);

    return this;
  }

  /**
   * Emits an event of a specific type, invoking all registered listeners for that event type with the provided data.
   * Also calls any global event listeners with a {@link GlobalEvent} object.
   *
   * @template TType - Event type.
   * @param type - The identifier for the event type to emit.
   * @param data - The data to pass to the event listeners. The type of this data is defined by the corresponding value in TEvents.
   * @return The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * emitter.emit("data", "Sample data");
   * emitter.emit("loaded");
   * emitter.emit("error", new Error("Oh no!"));
   * ```
   */
  public emit<TType extends keyof TEvents>(
    type: TType,
    ...data: TEvents[TType] extends void ? [] : [data: TEvents[TType]]
  ): this {
    this.listeners[type]?.forEach((listener) => listener.apply(this, data));

    const globalEvent = {
      type,
      data: data.length ? data[0] : undefined,
    } as GlobalEvent<TEvents>;

    for (const listener of this.globalListeners) {
      listener.call(this, globalEvent);
    }

    return this;
  }

  /**
   * Removes all listeners for all event types, as well as all global listeners.
   *
   * @returns The {@link EventEmitter} instance itself, allowing for method chaining.
   *
   * @example
   * ```ts
   * emitter.clear(); // No more event listeners remain
   * ```
   */
  public clear() {
    for (const key in this.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.listeners, key)) {
        delete this.listeners[key];
      }
    }

    this.globalListeners.clear();

    return this;
  }
}

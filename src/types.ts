import { EventEmitter } from "./event-emitter";

export type EventMap = Record<PropertyKey, unknown>;

/**
 * Defines a function type for event listeners.
 * The context (`this`) within the listener function is bound to the instance of the {@link EventEmitter}.
 * This design allows for strongly typed event handling, based on the specified event types and their associated data.
 *
 * @template TEvents - An object type mapping event names to their associated data types.
 * @template TData - The type of data that the event listener expects to receive. Can be void if no data is passed with the event.
 * @template TEmitter - The specific type of the {@link EventEmitter} instance to which the listener is bound.
 */
export type EventListener<TEvents extends EventMap, TData, TEmitter extends EventEmitter<TEvents>> = (
  this: TEmitter,
  ...data: TData extends void ? [] : [data: TData]
) => void | Promise<void>;

/**
 * A discriminated union representing all possible emitted events,
 * containing the event type and the associated data if it exists.
 *
 * @template TEvents - An object type mapping event names to associated data types.
 */
export type GlobalEvent<TEvents extends EventMap> = {
  [TType in keyof TEvents]: TEvents[TType] extends void ? { type: TType } : { type: TType; data: TEvents[TType] };
}[keyof TEvents];

/**
 * Defines a function type for global event listeners.
 * This listener is invoked for every event type emitted by the {@link EventEmitter} instance.
 *
 * @template TEvents - An object type mapping event names to associated data types.
 * @template TEmitter - The specific type of the {@link EventEmitter} instance to which the listener is bound.
 */
export type GlobalEventListener<TEvents extends EventMap, TEmitter extends EventEmitter<TEvents>> = (
  this: TEmitter,
  event: GlobalEvent<TEvents>
) => void | Promise<void>;

import { EventEmitter } from "./event-emitter";

/**
 * Defines a function type for event listeners.
 * The context (`this`) within the listener function is bound to the instance of the {@link EventEmitter}.
 * This design allows for strongly typed event handling, based on the specified event types and their associated data.
 *
 * @template TEvents - An object type mapping event names to their associated data types.
 * @template TData - The type of data that the event listener expects to receive. Can be void if no data is passed with the event.
 * @template TEmitter - The specific type of the {@link EventEmitter} instance to which the listener is bound.
 */
export type EventListener<
  TEvents extends Record<PropertyKey, unknown>,
  TData,
  TEmitter extends EventEmitter<TEvents>
> = (this: TEmitter, ...data: TData extends void ? [] : [data: TData]) => void | Promise<void>;

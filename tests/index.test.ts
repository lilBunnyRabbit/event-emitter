import { EventEmitter } from "../src";

describe("event-emitter", () => {
  type MyEvents = {
    data: string;
  };

  let emitter!: EventEmitter<MyEvents>;

  test("new EventEmitter()", () => {
    emitter = new EventEmitter<MyEvents>();

    expect(emitter).toBeInstanceOf(EventEmitter);
  });

  test("EventEmitter.on/emit/off", () => {
    let onDataPayload: { emitter: EventEmitter<MyEvents>; data: string } | null = null;

    function onData(this: EventEmitter<MyEvents>, data: string) {
      onDataPayload = { emitter: this, data };
    }

    emitter.on("data", onData);

    const onValue = "123";
    emitter.emit("data", onValue);

    expect(onDataPayload).not.toBe(null);
    expect(onDataPayload!.emitter).toBeInstanceOf(EventEmitter);
    expect(onDataPayload!.data).toBe(onValue);

    emitter.off("data", onData);

    const offValue = "456";
    emitter.emit("data", offValue);

    expect(onDataPayload).not.toBe(null);
    expect(onDataPayload!.emitter).toBeInstanceOf(EventEmitter);
    expect(onDataPayload!.data).toBe(onValue);
  });

  test("extends EventEmitter", () => {
    type MyCustomEvents = {
      test: string;
    };

    class MyEventEmitter extends EventEmitter<MyCustomEvents> {
      test(value: string) {
        this.emit("test", value);
      }
    }

    const myEmitter = new MyEventEmitter();

    let onTestPayload: { emitter: MyEventEmitter; data: string } | null = null;

    function onTest(this: MyEventEmitter, data: string) {
      onTestPayload = { emitter: this, data };
    }

    myEmitter.on("test", onTest);

    const onValue = "123";
    myEmitter.emit("test", onValue);

    expect(onTestPayload).not.toBe(null);
    expect(onTestPayload!.emitter).toBeInstanceOf(MyEventEmitter);
    expect(onTestPayload!.emitter).toBeInstanceOf(EventEmitter);
    expect(onTestPayload!.data).toBe(onValue);

    myEmitter.off("test", onTest);

    const offValue = "456";
    myEmitter.emit("test", offValue);

    expect(onTestPayload).not.toBe(null);
    expect(onTestPayload!.emitter).toBeInstanceOf(MyEventEmitter);
    expect(onTestPayload!.emitter).toBeInstanceOf(EventEmitter);
    expect(onTestPayload!.data).toBe(onValue);
  });
});

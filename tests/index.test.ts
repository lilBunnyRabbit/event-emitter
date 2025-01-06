import { EventEmitter, GlobalEvent } from "../src";

describe("event-emitter", () => {
  type MyEvents = {
    data: string;
    loaded: void;
    error: Error;
  };

  let emitter!: EventEmitter<MyEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<MyEvents>();
  });

  test("new EventEmitter()", () => {
    expect(emitter).toBeInstanceOf(EventEmitter);
  });

  test("EventEmitter.on/emit/off for non-void event", () => {
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

    expect(onDataPayload!.data).toBe(onValue); // Listener should not be called after off
  });

  test("EventEmitter.on/emit/off for void event", () => {
    let loadedCalled = false;

    function onLoaded(this: EventEmitter<MyEvents>) {
      loadedCalled = true;
    }

    emitter.on("loaded", onLoaded);

    emitter.emit("loaded");

    expect(loadedCalled).toBe(true);

    loadedCalled = false;
    emitter.off("loaded", onLoaded);

    emitter.emit("loaded");

    expect(loadedCalled).toBe(false); // Listener should not be called after off
  });

  test("EventEmitter.on/emit/off for error event", () => {
    let onErrorPayload: Error | null = null;

    function onError(this: EventEmitter<MyEvents>, error: Error) {
      onErrorPayload = error;
    }

    emitter.on("error", onError);

    const error = new Error("Test error");
    emitter.emit("error", error);

    expect(onErrorPayload).toBe(error);

    emitter.off("error", onError);

    const newError = new Error("New error");
    emitter.emit("error", newError);

    expect(onErrorPayload).toBe(error); // Listener should not be called after off
  });

  test("EventEmitter.onAll/offAll", () => {
    let globalEvents: GlobalEvent<MyEvents>[] = [];

    function onAll(event: GlobalEvent<MyEvents>) {
      globalEvents.push(event);
    }

    emitter.onAll(onAll);

    const dataValue = "test-data";
    const error = new Error("Test error");

    emitter.emit("data", dataValue);
    emitter.emit("loaded");
    emitter.emit("error", error);

    expect(globalEvents).toEqual([
      { type: "data", data: dataValue },
      { type: "loaded" },
      { type: "error", data: error },
    ]);

    globalEvents = [];
    emitter.offAll(onAll);

    emitter.emit("data", "new-data");
    expect(globalEvents).toEqual([]); // Listener should not be called after offAll
  });

  test("EventEmitter.clear", () => {
    let dataCalled = false;
    let loadedCalled = false;
    let globalCalled = false;

    emitter.on("data", () => {
      dataCalled = true;
    });

    emitter.on("loaded", () => {
      loadedCalled = true;
    });

    emitter.onAll(() => {
      globalCalled = true;
    });

    emitter.clear();

    emitter.emit("data", "123");
    emitter.emit("loaded");

    expect(dataCalled).toBe(false);
    expect(loadedCalled).toBe(false);
    expect(globalCalled).toBe(false);
  });

  test("Extending EventEmitter", () => {
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

    expect(onTestPayload!.data).toBe(onValue); // Listener should not be called after off
  });
});

import * as React from 'react';

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

let activeFunc: Function | null = null;
let activeUnregister: Function | null = null;

// Our simple Dep class
class Dep {
  private subscribers: Set<Function>;
  constructor() {
    this.subscribers = new Set();
  }
  depend() {
    // activeFunc && console.log('activeFunc', activeFunc);
    // activeUnregister && console.log('active unreg', activeUnregister);
    // activeUnregister && console.log(this.subscribers.has(activeUnregister));
    if (activeFunc && !this.subscribers.has(activeFunc)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.add(activeFunc);
    }
    if (activeUnregister && this.subscribers.has(activeUnregister)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.delete(activeUnregister);
    }
  }
  notify() {
    console.log(this.subscribers)
    this.subscribers.forEach((sub) => sub());
  }
  unsub() {
    // this.subscribers.
  }
}
window.depsArr = [];

export function reactive<T extends object>(target: Record<string, any>) {
  let deps = new Map(); // Let's store all of our data's deps in a map
  depsArr.push(deps);

  Object.keys(target).forEach((key: keyof typeof target) => {
    deps.set(key, new Dep());
  });


  const handler = {
    // Override data to have a proxy in the middle
    get(target: object, key: string | number | symbol, receiver: any): any {

      let result = Reflect.get(target, key, receiver);
      if (deps.has(key)) {
        deps.get(key).depend();
      } else {
        const newDep = new Dep();
        newDep.depend();
        deps.set(key, newDep);
      }

      return result;
    },

    set(
      target: object,
      key: string | number | symbol,
      value: any,
      receiver: any,
    ) {

      let oldValue = (target as any)[key];

      let result = Reflect.set(target, key, value, receiver);

      if (oldValue != value) {

        deps.get(key).notify();
      }
      return result;
    },
  };

  return new Proxy(target, handler) as T;
}

// set target and clear target
export function watcher(myFunc: Function) {
  activeFunc = myFunc;
  // execute the function
  activeFunc();
  activeFunc = null;
}
export function unregister(myFunc: Function) {
  return () => {
    activeUnregister = myFunc;
    // execute the function
    activeUnregister();
    activeUnregister = null;
  }
}
export function Observer(props: {children: Function}) {
  const {children} = props;
  const [, forceUpdate] = React.useState(1);
  const effectFn = React.useCallback(() => {
    children();
    forceUpdate((c) => c + 1);
  }, [children]);
  React.useEffect(() => {
    watcher(effectFn);
    // return unregister(effectFn);
  }, [children]);
  return <span>{children()}</span>;
}

function recursivelyAccess(obj: Record<string, any>) {
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    obj[key];
    if (isObject(obj[key])) {
      recursivelyAccess(obj[key]);
    }
  });
}

export function useReactor(
  store: Record<string, any>,
) {
  const [, forceUpdate] = React.useState(1);

  React.useEffect(() => {
    watcher(() => {
      recursivelyAccess(store);
      forceUpdate((c) => c + 1);
    });
  }, []);
}
export function useWatcher(fn: () => any) {
  watcher(fn);
}

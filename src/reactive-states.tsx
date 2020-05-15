import * as React from 'react';

let target: Function | null = null;

// Our simple Dep class
class Dep {
  private subscribers: Array<Function>;
  constructor() {
    this.subscribers = [];
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.push(target);
    }
  }
  notify() {
    this.subscribers.forEach((sub) => sub());
  }
}
export function createStore(data: Record<string, any>) {
  // let data = { price: 5, quantity: 2 };

  let deps = new Map(); // Let's store all of our data's deps in a map
  Object.keys(data).forEach((key: keyof typeof data) => {
    // Each property gets a dependency instance
    deps.set(key, new Dep());
  });

  let data_without_proxy = data; // Save old data object
  data = new Proxy(data_without_proxy, {
    // Override data to have a proxy in the middle
    get(obj, key: keyof typeof data) {
      // push the current target to the dep's dep_list
      // console.log('getting', obj[key])
      deps.get(key).depend(); // <-- Remember the target we're running
      return obj[key]; // call original data
    },
    set(obj, key: keyof typeof data, newVal) {
      // console.log('setting!')
      obj[key] = newVal; // Set original data to new value
      deps.get(key).notify(); // <-- Re-run stored functions
      return true;
    },
  });

  return data;
}

// set target and clear target
export function watcher(myFunc: Function) {
  target = myFunc;
  // execute the function
  target();
  target = null;
}

export function Observer(props: {children: Function}) {
  const {children} = props;
  const [, forceUpdate] = React.useState(1);
  React.useEffect(() => {
    watcher(() => {
      children();
      forceUpdate((c) => c + 1);
    });
  }, [children]);
  return <span>{children()}</span>;
}

export function useReactive(
  store: Record<string, any>,
  depKeys?: Array<keyof typeof store>,
) {
  const keys = depKeys || Object.keys(store);
  const [, forceUpdate] = React.useState(1);

  React.useEffect(() => {
    watcher(() => {
      keys.forEach((key) => {
        store[key];
      });
      forceUpdate((c) => c + 1);
    });
  }, []);
}


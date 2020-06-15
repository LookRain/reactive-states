import * as React from 'react';

// reactive function code adapted from https://github.com/Code-Pop/vue-3-reactivity
const targetMap = new WeakMap();
let activeUnregister: (() => any) | null = null;
let activeEffect: (() => any) | null = null;
(window as any).targetMap = targetMap;


export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

function effect(eff: () => any) {
  activeEffect = eff;
  activeEffect && activeEffect();
  activeEffect = null;
}

function track(target: object, key: unknown) {
  if (activeUnregister) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    if (dep.has(activeUnregister)) {
      dep.delete(activeUnregister);
    }
    return;
  }
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);
  }
}
function trigger(target: object, key: unknown) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((eff: () => void) => {
      eff();
    });
  }
}


const arrayInstrumentations: Record<string, Function> = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
  console.log('key', key, 'arrayInstrumentations', arrayInstrumentations)
  arrayInstrumentations[key] = function(...args: any[]): any {
    const arr = (this) as any
    for (let i = 0, l = (this as any).length; i < l; i++) {
      track(arr, i + '')
    }
    // we run the method using the original args first (which may be reactive)
    const res = arr[key](...args)
    if (res === -1 || res === false) {
      // if that didn't work, run it again using raw values.
      return arr[key](...args)
    } else {
      return res
    }
  }
})

export function reactive<T extends object>(target: T) {
  const handler = {
    get(target: object, key: string | number | symbol, receiver: any): any {
      // console.log('getting', key);

      let result = Reflect.get(target, key, receiver);
      track(target, key);

      // if (Array.isArray(result)) {
      //   console.log('is array');

      //   return Reflect.get(arrayInstrumentations, key, receiver)
      // }

      if (isObject(result)) {
        return reactive(result);
      }
      return result;
    },
    set(
      target: object,
      key: string | number | symbol,
      value: any,
      receiver: any,
    ) {
      console.log('setting', key)
      let oldValue = (target as any)[key];

      let result = Reflect.set(target, key, value, receiver);
      if (oldValue != value) {
        trigger(target, key); // If this reactive property (target) has effects to rerun on SET, trigger them.
      }
      return result;
    },
  };
  return new Proxy(target, handler) as T;
}

export function unwatch(myFunc: () => any) {
  return () => {
    activeUnregister = myFunc;
    // execute the function
    activeUnregister();
    activeUnregister = null;
  };
}


export function Observer(props: {children: Function}) {
  const {children} = props;
  const [, forceUpdate] = React.useState(1);
  const effectFn = React.useCallback(() => {
    children();
    forceUpdate((c) => c + 1);
  }, [children]);
  React.useEffect(() => {
    effect(effectFn);
    return unwatch(effectFn);
  }, [children]);
  return <span>{children()}</span>;
}

function recursivelyAccess(obj: unknown) {
  if (Array.isArray(obj)) {
    obj.forEach(recursivelyAccess);
    return;
  }
  if (isObject(obj)) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      obj[key];
      if (isObject(obj[key])) {
        recursivelyAccess(obj[key]);
      }
    });
  }
}

export function useReactor(store: Record<string, any>) {
  // const keys = Object.keys(store);
  const [, forceUpdate] = React.useState(1);
  const effectFn = React.useCallback(() => {
    recursivelyAccess(store);
      forceUpdate((c) => c + 1);
  }, []);
  React.useEffect(() => {
    effect(effectFn);
    return unwatch(effectFn);

  }, []);
}

export const watch = effect;
export function useWatcher(fn: () => any) {
  React.useEffect(() => {
    effect(fn);
    return unwatch(fn)
  }, [fn]);
}

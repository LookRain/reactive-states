export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

let activeUnregister: (() => any) | null = null;

export function unwatch(myFunc: () => any) {
  return () => {
    activeUnregister = myFunc;
    // execute the function
    activeUnregister();
    activeUnregister = null;
  };
}

const targetMap = new WeakMap();

let activeEffect: (() => any) | null = null;
(window as any).targetMap = targetMap;

export function effect(eff: () => any) {
  activeEffect = eff;
  activeEffect && activeEffect();
  activeEffect = null;
}

/**
 *
  Adds the target object to targetMap, adds the ineterested key to its depsMap, adds the active effect to its deps Set
 */
function track(target: Record<string, unknown>, key: unknown) {
  if (activeUnregister) {
    const depsMap = targetMap?.get(target);
    const dep = depsMap?.get(key);
    if (dep?.has(activeUnregister)) {
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

function trigger(target: Record<string, unknown>, key: unknown) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((eff: () => void) => {
      eff();
    });
  }
}

// const ARRAY_KEYS = ['length',]

export function reactive<T extends Record<string, unknown>>(target: T) {
  const handler = {
    get(
      target: Record<string, unknown>,
      key: string | number | symbol,
      receiver: any
    ): any {
      const result = Reflect.get(target, key, receiver);
      track(target, key);

      if (isObject(result)) {
        return reactive(result);
      }
      return result;
    },
    set(
      target: Record<string, unknown>,
      key: string | number | symbol,
      value: any,
      receiver: any
    ) {
      // const oldValue = (target as any)[key];

      const result = Reflect.set(target, key, value, receiver);
      // if (oldValue !== value || key === 'length') {
      trigger(target, key); // If this reactive property (target) has effects to rerun on SET, trigger them.
      // }
      return result;
    },
  };
  return new Proxy(target, handler as any) as T;
}

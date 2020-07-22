import * as React from 'react';
import { unwatch, effect, isObject } from './reactive-states';

export function Observer(props: { children: () => any }) {
  const { children } = props;
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
    obj.length;
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
    return unwatch(fn);
  }, [fn]);
}

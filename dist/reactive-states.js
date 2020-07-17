export const isObject = (val) => val !== null && typeof val === 'object';
let activeUnregister = null;
export function unwatch(myFunc) {
    return () => {
        activeUnregister = myFunc;
        activeUnregister();
        activeUnregister = null;
    };
}
const targetMap = new WeakMap();
let activeEffect = null;
window.targetMap = targetMap;
export function effect(eff) {
    activeEffect = eff;
    activeEffect && activeEffect();
    activeEffect = null;
}
function track(target, key) {
    if (activeUnregister) {
        const depsMap = targetMap.get(target);
        const dep = depsMap.get(key);
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
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach((eff) => {
            eff();
        });
    }
}
export function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            track(target, key);
            if (isObject(result)) {
                return reactive(result);
            }
            return result;
        },
        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);
            if (oldValue != value) {
                trigger(target, key);
            }
            return result;
        },
    };
    return new Proxy(target, handler);
}
//# sourceMappingURL=reactive-states.js.map
import {reactive, useWatcher, useReactor, Observer, isObject} from './reactive-states';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAge() {
  await sleep(100);
  return {
    age: 99,
  };
}

function recursiveReactive(obj: Record<string, any>) {

  obj = reactive(obj);
  Object.keys(obj).forEach((key) => {
    // if (obj[key]) {
      if (isObject(obj[key])) {

        obj[key] = recursiveReactive(obj[key]);
      } else {
        // obj[key] = reactive(obj[key])
      }
    // }
  });
  return obj;
}
export const store = recursiveReactive({
  name: 'ali',
  age: 31,
  updateStatus: 'success',
  edu: {
    school: 'nus',
    year: 1,
  },
});
window.store = store;
export function increAge() {
  store.age++;
}

export function incrementYear() {
  // store.edu.school = 'zzz';
  store.edu.year++;
}
export async function updateAgeWithRemote() {
  store.updateStatus = 'loading';
  const res = await fetchAge();
  store.updateStatus = 'success';
  store.age = res.age;
}

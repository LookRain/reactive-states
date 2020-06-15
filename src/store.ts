import {reactive, useWatcher, useReactor, Observer} from './reactive-states';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAge() {
  await sleep(100);
  return {
    age: 99,
  };
}

export const store = reactive({
  name: 'ali',
  age: 31,
  updateStatus: 'success',
  edu: {
    school: 'nus',
    year: 1,
  },
});

export function increAge() {
  store.age++;
}

export function incrementYear() {
  store.edu.year++;
}
export async function updateAgeWithRemote() {
  store.updateStatus = 'loading';
  const res = await fetchAge();
  store.updateStatus = 'success';
  store.age = res.age;
}
import {reactive} from './reactive-states';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAge() {
  await sleep(100);
  return {
    age: 99,
  };
}

export const store: {
  name: string;
  age: number;
  updateStatus: string;
  edu: {
      school: string;
      year: number;
  };
  senior?: boolean;
} = reactive({
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
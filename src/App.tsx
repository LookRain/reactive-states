import * as React from 'react';

import './App.css';


import {reactive, useWatcher, useReactor, Observer} from './reactive-states';

const store = reactive({
  name: 'ali',
  age: 31,
  edu: {
    school: 'nus',
    year: 1,
  },
});

function increAge() {
  store.age++;
}
function changeSchool() {
  store.edu.school = 'zxcvzxcv';
}
function incrementYear() {
  store.edu.year++;
}

function DemouseReactor() {
  const ageDoubled = store.age * 2;

  useReactor(store);

  return (
    <div>
      <button onClick={increAge}>increment age</button>
      <button
        onClick={() => {
          store.age--;
        }}
      >
        decrement age
      </button>
      <button onClick={incrementYear}>increment year</button>
      <p>name: {store.name}</p>
      <p>age: {store.age}</p>
      <p>school: {store.edu.school}</p>
      <p>year: {store.edu.year}</p>
      <p>age double: {ageDoubled}</p>
    </div>
  );
}

function DemoObserver() {
  useWatcher(() => {
    console.log('age change', store.age);
    if (store.age > 40) {
      store.name = store.name.includes('old')
        ? store.name
        : `old ${store.name}`;
      store.senior = true;
    }
  });
  useWatcher(() => {
    console.log('name change', store.name);
  });
  return (
    <div>
      <button onClick={increAge}>increment age</button>
      <button
        onClick={() => {
          store.age--;
        }}
      >
        decrement age
      </button>
      <button onClick={incrementYear}>increment year</button>
      <p>
        name: <Observer>{() => store.name}</Observer>
      </p>
      <p>
        age:<Observer>{() => store.age}</Observer>
      </p>
      <p>school: {store.edu.school}</p>
      <p>
        year: <Observer>{() => store.edu.year}</Observer>
      </p>
      <p>
        senior: <Observer>{() => (store.senior ? 'yes' : 'no')}</Observer>
      </p>
      {/* <p>age double: {ageDoubled}</p> */}
    </div>
  );
}
function App() {
  return (
    <div>
      <DemouseReactor />
      <hr />
      <DemoObserver />
    </div>
  );
}

export default App;

import * as React from 'react';

import './App.css';

import {useWatcher, useReactor, Observer} from './reactive-states';
import {store, increAge, incrementYear, updateAgeWithRemote, addCourse} from './store';

const btnBlue =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold mx-5 my-2 py-2 px-4 rounded';
const card =
  'max-w-sm rounded overflow-hidden p-4 shadow-lg flex flex-col mx-auto my-4';

function DemoReactor() {
  const ageDoubled = store.age * 2;

  useReactor(store);

  return (
    <div className={card}>
      <button className={btnBlue} onClick={increAge}>
        increment age
      </button>
      <button
        className={btnBlue}
        onClick={() => {
          store.age--;
        }}
      >
        decrement age
      </button>
      <button className={btnBlue} onClick={updateAgeWithRemote}>
        updateAgeWithRemote
      </button>
      <button className={btnBlue} onClick={incrementYear}>
        increment year
      </button>
      <button className={btnBlue} onClick={addCourse}>
        add course
      </button>
      <p>name: {store.name}</p>
      {store.updateStatus === 'loading' ? (
        <span className="lds-dual-ring" />
      ) : (
        <p>age: {store.age}</p>
      )}

      <p>school: {store.edu.school}</p>
      <p>year: {store.edu.year}</p>
      <p>courses: {store.courses.map(c => <div key={c}>{c}</div>)}</p>
      {/* {JSON.stringify(store)} */}
      {/* <p>course 3: {store.courses[2]}</p> */}
      <p>age double: {ageDoubled}</p>
    </div>
  );
}

function DemoObserver() {
  useWatcher(() => {
    // console.log('age change', store.age);
    if (store.age > 40) {
      store.name = store.name.includes('old')
        ? store.name
        : `old ${store.name}`;
      store.senior = true;
    }
  });
  useWatcher(() => {
    // console.log('name change', store.name);
  });
  return (
    <div className={card}>
      <button className={btnBlue} onClick={increAge}>
        increment age
      </button>
      <button
        className={btnBlue}
        onClick={() => {
          store.age--;
        }}
      >
        decrement age
      </button>
      <button className={btnBlue} onClick={updateAgeWithRemote}>
        updateAgeWithRemote
      </button>
      <button className={btnBlue} onClick={incrementYear}>
        increment year
      </button>
      <p>
        name: <Observer>{() => store.name}</Observer>
      </p>
      <p>
        age:
        <Observer>
          {() => (
            <>
              {store.updateStatus === 'loading' ? (
                <span className="lds-dual-ring" />
              ) : (
                store.age
              )}
            </>
          )}
        </Observer>
      </p>
      <p>school: {store.edu.school}</p>
      <p>
        year: <Observer>{() => store.edu.year}</Observer>
      </p>
      <p>courses: <Observer>{() => store.courses.map(c => <div key={c}>{c}</div>)}</Observer></p>

      <p>
        senior: <Observer>{() => (store.senior ? 'yes' : 'no')}</Observer>
      </p>
      {/* <p>age double: {ageDoubled}</p> */}
    </div>
  );
}

function FlagControlled() {
  const [flag, setFlag] = React.useState(true);
  return (
    <div className="m-auto">
      <button
        className={btnBlue}
        onClick={() => {
          setFlag((a) => !a);
        }}
      >
        toggle
      </button>
      {flag && <DemoReactor />}
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col text-center ">
      <DemoReactor />
      <hr />
      <DemoObserver />
      <hr />
      <FlagControlled />
    </div>
  );
}

export default App;

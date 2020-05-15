import * as React from 'react';

import './App.css';
import {createStore, watcher, Observer, useReactive} from './reactive-states';

const form = createStore({
  name: 'old',
  age: 1,
});

function increAge() {
  form.age += 1;
}

function setName(e: React.ChangeEvent<HTMLInputElement>) {
  form.name = e.target.value;
}
function UsingUseReactive() {
  useReactive(form);
  return (
    <div>
      Set Name<input onChange={setName} />
      name: {form.name}
      <br />
      <button onClick={increAge}>Age += 1</button>
      age: {form.age}
    </div>
  );
}

function UsingObserver() {
  return (
    <div>
      Set Name<input onChange={setName} />
      name: <Observer>{() => form.name}</Observer>
      <br />
      <button onClick={increAge}>Age += 1</button>
      age: <Observer>{() => form.age}</Observer>
    </div>
  );
}



function App() {
  return (
    <div className={'App'}>
      <h1>with `useReactive`</h1>
      <p>
        use the `useReactive` hook. causes the entire component to re-render
      </p>
      <UsingUseReactive />
      <hr />
      <h1>{'with `<Observer />`'}</h1>
      <p>
        use the `Observer` component to wrap around the components that
        substribe the the changes from data. will only re-render the wrapped
        around data
      </p>
      <UsingObserver />

    </div>
  );
}

export default App;

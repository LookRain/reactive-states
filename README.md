## API

### `createStore`

create an observable state

```ts
import {createStore} from 'reactive-states';

const form = createStore({
  name: 'old',
  age: 1,
});
```


### `useReactor`

hook that takes in a observable state object, makes the component that uses this hook reactive. If any of the properties of the store is accessed by this compoennt, it will re-render when the property is changed.

```tsx
import {useReactor} from 'reactive-states';

function UsinguseReactor() {
  useReactor(form);
  const ageDoubled = form.age * 2;
  const {age} = form;
  return (
    <div>
      Set Name<input onChange={setName} />
      name: {form.name}
      <br />
      <button onClick={increAge}>Age += 1</button>
      age: {age}
      ageDoubled: {ageDoubled}
    </div>
  );
}
```


### `<Observer />`

Similar to `useReactor`, it should be used to wrap around a `store.property` accessor.
Note: When using this approach, you can't do data destructuring or derived componented values.

```tsx
import {Observer} from 'reactive-states';

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

```

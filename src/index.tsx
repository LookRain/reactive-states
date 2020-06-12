import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// // const store = reactive({
// //   name: 'haha',
// //   age: 33,
// //   edu: {
// //     school: 'nus'
// //   }
// // })
// (window as any).reactive = reactive;
// (window as any).watch = watch;
// (window as any).store = store;
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

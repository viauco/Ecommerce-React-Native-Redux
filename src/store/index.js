// src/js/index.js

import { createStore, applyMiddleware,compose  } from "redux";
import RootReducer from "../reducers/index";
import { checkEmpty } from "../middlewares/index.js";
import thunk from "redux-thunk";
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store = createStore(
  RootReducer,
  storeEnhancers(applyMiddleware(checkEmpty,thunk))
);

export default Store;
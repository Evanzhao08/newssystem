import { legacy_createStore as createStore, combineReducers } from "redux";
import { CollApsedReducer } from "./reducer/CollapsedReducer";
import { LoadingReducer } from "./reducer/LoadingReducer";
// import { composeWithDevTools } from "redux-devtools-extension";
import { composeWithDevTools } from "@redux-devtools/extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const reducer = combineReducers({ CollApsedReducer, LoadingReducer });
const persistConfig = {
  key: "evanRoot",
  storage,
  blacklist: ["LoadingReducer"], // LoadingReducer will not be persisted
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, composeWithDevTools());

let persistor = persistStore(store);
export { store, persistor };

import { combineReducers } from "redux";
import BooleanReducer from "./reducers/BooleanReducer";
import AuthReducer from "./reducers/AuthReducer";

const rootReducer = combineReducers({
    booleans : BooleanReducer,
    auth : AuthReducer
});

export default rootReducer;


import { combineReducers } from "redux";
import BooleanReducer from "./reducers/BooleanReducer";

const rootReducer = combineReducers({
    booleans : BooleanReducer
});

export default rootReducer;


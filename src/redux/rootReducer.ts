import { combineReducers } from "redux";
import BooleanReducer from "./reducers/BooleanReducer";
import AuthReducer from "./reducers/AuthReducer";
import InboxReducer from "./reducers/InboxReducer";

const rootReducer = combineReducers({
    booleans : BooleanReducer,
    auth : AuthReducer,
    inbox: InboxReducer
});

export default rootReducer;


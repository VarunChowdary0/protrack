import { combineReducers } from "redux";
import BooleanReducer from "./reducers/BooleanReducer";
import AuthReducer from "./reducers/AuthReducer";
import InboxReducer from "./reducers/InboxReducer";
import allProjectsReducer from "./reducers/AllProjectsReducer";
import SelectedProjectReducer from "./reducers/SelectedProject";

const rootReducer = combineReducers({
    booleans : BooleanReducer,
    auth : AuthReducer,
    inbox: InboxReducer,
    allProjects: allProjectsReducer,
    selectedProject: SelectedProjectReducer
});

export default rootReducer;


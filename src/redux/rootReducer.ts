import { combineReducers } from "redux";
import BooleanReducer from "./reducers/BooleanReducer";
import AuthReducer from "./reducers/AuthReducer";
import InboxReducer from "./reducers/InboxReducer";
import allProjectsReducer from "./reducers/AllProjectsReducer";
import SelectedProjectReducer from "./reducers/SelectedProject";
import TasksReducer from "./reducers/TasksReducer";


const rootReducer = combineReducers({
    booleans : BooleanReducer,
    auth : AuthReducer,
    inbox: InboxReducer,
    allProjects: allProjectsReducer,
    selectedProject: SelectedProjectReducer,
    tasks: TasksReducer
});

export default rootReducer;


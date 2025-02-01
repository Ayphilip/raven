import { combineReducers, compose, applyMiddleware } from "redux";
import { legacy_createStore as createStore} from 'redux'
// import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import { thunk } from "redux-thunk";
import Cookies from "js-cookie";

// const adminInfo = Cookie.getJSON("adminInfo") || null;
const adminInfo = Cookies.get('adminInfo') ? JSON.parse(Cookies.get('adminInfo')) : null;

const initialState = { userSignin:{ adminInfo } };
const reducer = combineReducers({
    
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store;
import { combineReducers } from './combineReducers';
import { userReducer } from './user/user.reducer';

export const initialState: AppState = {
  user: {
    isLoggedin: false,
    id:0,
    accessToken:"",
    tokenType:"",
    isLoading:false,
    darkMode: false,
    data: {},
  }
};

export const reducers = combineReducers({
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
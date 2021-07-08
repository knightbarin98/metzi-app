import { UserActions } from "./user.actions";
import { UserState } from "./user.state";

export function userReducer(state: UserState, action: UserActions) {
  switch (action.type) {
    case "set-is-loggedin":
      return { ...state, isLoggedin: action.isLoggedin };
    case "set-is-loading":
      return { ...state, loading: action.isLoading };
    case "set-id":
      return { ...state, id: action.id };
    case "set-access-token":
      return { ...state, accessToken: action.accessToken };
    case "set-token-type":
      return { ...state, tokenType: action.tokenType };
    case "set-dark-mode":
      return { ...state, darkMode: action.darkMode };
    case "set-data":
      return { ...state, data: action.data };
  }
}

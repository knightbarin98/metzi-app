import { ActionType } from "../../util/types";
import { storageGet, storageRemove } from "../../util/storage";

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setIsLoading(true));

  const isLoggedIn = await storageGet("isLoggedIn");
  const accessToken = await storageGet("access_token");
  const tokenType = await storageGet("token_type");
  const data = await storageGet("data");
  const id = await storageGet("id");

  
  dispatch(setData(data));
  dispatch(setId(+id));
  dispatch(setAccessToken(accessToken));
  dispatch(setTokenType(tokenType));
  dispatch(setIsLoggedIn(isLoggedIn || false));

  dispatch(setIsLoading(false));
};

export const logOut = () => async (dispatch: React.Dispatch<any>) => {
  await storageRemove("isLoggedIn");
  await storageRemove("access_token");
  await storageRemove("token_type");
  await storageRemove("id");
  await storageRemove("data");

  dispatch(setIsLoggedIn(false));
  dispatch(setData({}));
  dispatch(setAccessToken(""));
  dispatch(setTokenType(""));
  dispatch(setId(0));
};

export const setIsLoading = (isLoading: boolean) =>
  ({
    type: "set-is-loading",
    isLoading,
  } as const);

export const setIsLoggedIn = (isLoggedin: boolean) =>
  ({
    type: "set-is-loggedin",
    isLoggedin,
  } as const);

export const setId = (id: number) =>
  ({
    type: "set-id",
    id,
  } as const);

export const setAccessToken = (accessToken?: string) =>
  ({
    type: "set-access-token",
    accessToken,
  } as const);

export const setTokenType = (tokenType?: string) =>
  ({
    type: "set-token-type",
    tokenType,
  } as const);

export const setDarkMode = (darkMode: boolean) =>
  ({
    type: "set-dark-mode",
    darkMode,
  } as const);

export const setData = (data: any) =>
  ({
    type: "set-data",
    data,
  } as const);

export type UserActions =
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setIsLoading>
  | ActionType<typeof setId>
  | ActionType<typeof setAccessToken>
  | ActionType<typeof setTokenType>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setData>;

export interface UserState {
  isLoggedin: boolean;
  isLoading: boolean;
  id: number;
  accessToken?: string;
  tokenType?: string;
  darkMode: boolean;
  data: any;
}
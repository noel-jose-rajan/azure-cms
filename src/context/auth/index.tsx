import {
  createContext,
  useState,
  useEffect,
  useContext,
  startTransition,
} from "react";
import { NavigateFunction } from "react-router-dom";
import LOCALSTORAGE from "../../constants/local-storage";

import Storage from "../../lib/storage";
import { UserType } from "../../types/user";
import { z } from "zod";
import { userSchema } from "../../validators/user";
import apiRequest from "../../lib/api";
import useCustomMessage from "@/components/hooks/use-message";
import { useLanguage } from "../language";

export const loginSuccessSchema = z.object({
  message: z.string(),
  user: userSchema,
  access_token: z.string(),
  refresh_token: z.string(),
  exp: z.number(),
});

export const refreshTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  exp: z.number(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Please input your username!"),
  password: z.string().min(1, "Please input your password!"),
});
export type LoginType = z.infer<typeof loginSchema>;
export type LoginSuccessType = z.infer<typeof loginSuccessSchema>;
export type RefreshTokenType = z.infer<typeof refreshTokenSchema>;

// const legacyLogin = async () => {
//   // const data = { grant_type: "password", isSSO: "false", language: "en", "password": "Y21zQDEyMzQ=", "timeInSeconds": "", "username": "Zm4uc2Vj" }
//   const data = {
//     grant_type: "password",
//     isSSO: "false",
//     language: "en",
//     password: "Y21zQDEyMzQ=",
//     timeInSeconds: "",
//     username: "Y21zYWRtaW4=",
//   };
//   const urlEncodedData = new URLSearchParams(data).toString();

//   const LEGACY_URL = "http://37.34.239.150:9007";

//   const URL = LEGACY_URL + "/auth-server/oauth/token";

//   await fetch(URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: "Basic Y21zX21vYmlsZTpDbXNfbTBiIWwz",
//     },
//     body: urlEncodedData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Response:", data.access_token);
//       Storage.setItem(
//         LOCALSTORAGE.LEGACY_USER_ID,
//         data.AuthenticatedUserInformation.userId
//       );
//       Storage.setItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN, data.access_token);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };
const loginUser = async (
  login: LoginType
): Promise<LoginSuccessType | null> => {
  const response = await apiRequest("POST", "/Auth/login", login);

  if (response.data) {
    return response.data[0];
  }

  return null;
};

// const getRefreshToken = async (
//   accessToken: string,
//   refreshToken: string
// ): Promise<RefreshTokenType | null> => {
//   const response = await apiRequest(
//     "POST",
//     "/auth/refresh",
//     { refresh_token: refreshToken },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   if (response.data) {
//     return response.data[0];
//   }

//   return null;
// };

interface AuthContextType {
  user: UserType | null;
  accessToken: string | null;
  login: (credentials: LoginType, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => void;
  isAuthenticated: boolean;
  handleIsAuthenticated: (bool: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const navigate = useNavigate();
  //states
  const { showMessage } = useCustomMessage();
  const { isEnglish } = useLanguage();
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [_, setRefreshToken] = useState<string | null>(null);
  const [_refreshTime, setrefreshTime] = useState<number>(900);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // //constants
  // const isAuthenticated =
  //   !!Storage.getItem<UserType>(LOCALSTORAGE.USER) &&
  //   !!Storage.getItem<string>(LOCALSTORAGE.ACCESS_TOKEN);

  const loadTokens = () => {
    const storedAccessToken = Storage.getItem<string>(
      LOCALSTORAGE.ACCESS_TOKEN
    );
    const storedRefreshToken = Storage.getItem<string>(
      LOCALSTORAGE.REFRESH_TOKEN
    );
    const storedUser = Storage.getItem<UserType>(LOCALSTORAGE.USER);
    const storedRefreshTokenTime = Storage.getItem<string>(
      LOCALSTORAGE.REFRESH_TOKEN_TIME
    );

    if (
      storedAccessToken &&
      storedRefreshToken &&
      storedUser &&
      storedRefreshTokenTime
    ) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setrefreshTime(parseInt(storedRefreshTokenTime));
      setUser(storedUser);
    }
  };

  const handleIsAuthenticated = (bool: boolean) => {
    setIsAuthenticated(bool);
  };

  const login = async (credentials: LoginType, navigate: NavigateFunction) => {
    try {
      const response = await loginUser(credentials);

      if (response) {
        localStorage.setItem(
          "auth-event",
          JSON.stringify({ status: "login", timestamp: Date.now() })
        );

        Storage.setItem(LOCALSTORAGE.ACCESS_TOKEN, response.access_token);
        Storage.setItem(LOCALSTORAGE.REFRESH_TOKEN, response.refresh_token);
        Storage.setItem(LOCALSTORAGE.USER, response.user);
        Storage.setItem(LOCALSTORAGE.REFRESH_TOKEN_TIME, response.exp);
        startTransition(() => {
          navigate("");
        });

        setIsAuthenticated(true);
        setAccessToken(response.access_token);
        setRefreshToken(response.refresh_token);
        setrefreshTime(response.exp);
        setUser(response.user);
      }
    } catch (error) {
      console.error("Login failed:", error);
      showMessage(
        "error",
        isEnglish
          ? "user or passowrd is wrong"
          : "اسم المستخدم او كلمة السر خطأ"
      );
    }
  };

  const logout = (navigate: NavigateFunction) => {
    // Storage.clear();
    Storage.removeItem(LOCALSTORAGE.ACCESS_TOKEN);
    Storage.removeItem(LOCALSTORAGE.REFRESH_TOKEN);
    Storage.removeItem(LOCALSTORAGE.USER);
    Storage.removeItem(LOCALSTORAGE.REFRESH_TOKEN_TIME);
    localStorage.setItem(
      "auth-event",
      JSON.stringify({ status: "logout", timestamp: Date.now() })
    );
    navigate("/auth/login");
    startTransition(() => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setrefreshTime(0);
      setIsAuthenticated(false);
    });
  };

  // const refreshAccessToken = async () => {
  //   const accessToken = Storage.getItem<string>(LOCALSTORAGE.ACCESS_TOKEN);
  //   const refreshToken = Storage.getItem<string>(LOCALSTORAGE.REFRESH_TOKEN);

  //   if (!accessToken || !refreshToken) {
  //     logout();
  //     return;
  //   }

  //   try {
  //     const response = await getRefreshToken(accessToken, refreshToken);
  //     if (response) {
  //       Storage.setItem(LOCALSTORAGE.ACCESS_TOKEN, response.access_token);
  //       Storage.setItem(LOCALSTORAGE.REFRESH_TOKEN, response.refresh_token);

  //       setAccessToken(response.access_token);
  //       setRefreshToken(response.refresh_token);
  //     } else {
  //       logout();
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing access token:", error);
  //     logout();
  //   }
  // };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth-event" && event.newValue) {
        const { status } = JSON.parse(event.newValue);
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadTokens();

    // const interval = setInterval(() => {
    //   isAuthenticated && refreshAccessToken();
    // }, refreshTime * TIME_MS_TO_S_FACTOR);

    // return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthenticated,
        handleIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

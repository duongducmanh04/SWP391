import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  accountId: number;
  role: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  login: (values: {
    accountName: string;
    password: string;
  }) => Promise<{ success: boolean; message: string; role: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken ? storedToken : null,
    error: null,

    login: async (values) => {
      try {
        const response = await axios.post(
          "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/auth/login",
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = response.data;
        if (data.token) {
          const decoded = jwtDecode<{
            accountId: string;
            unique_name: string;
            role: string;
          }>(data.token);

          const user = {
            accountId: parseInt(decoded.accountId, 10),
            username: decoded.unique_name,
            role: decoded.role,
          };

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", data.token);

          set({ user, token: data.token, error: null });
          return { success: true, message: data.message, role: decoded.role };
        } else {
          set({ error: "Login failed" });
          return { success: false, message: "Login failed", role: "" };
        }
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : (error as Error).message;
        set({ error: errorMessage });
        return { success: false, message: errorMessage, role: "" };
      }
    },

    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({ user: null, token: null, error: null });
    },
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
  };
});

export default useAuthStore;

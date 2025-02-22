import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import useAuthStore from "./useAuthStore";
import authUtil from "../auth.util";

const fetchProfile = async () => {
  const accessToken = authUtil.getAccessToken();

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await axios.get("https://localhost:7071/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const useGetProfile = () => {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: fetchProfile,
    onSuccess: (response) => {
      const { data } = response;
      const { token } = data;

      // Decode token and update store
      const decoded = jwtDecode<{
        accountId: string;
        role: string;
        username: string;
      }>(token);
      setUser({
        accountId: parseInt(decoded.accountId, 10),
        username: decoded.username,
        role: decoded.role,
      });
      setToken(token);
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
    },
  });
};

export default useGetProfile;

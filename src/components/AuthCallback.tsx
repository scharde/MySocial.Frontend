// /auth-callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setStorage, StorageKeyType } from "@/Utils/storage";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiryTime = params.get("expiryTime");
    const refresh = params.get("refresh");

    if (token) {
      setStorage(StorageKeyType.Token, token);
      setStorage(StorageKeyType.RefreshToken, refresh || "");
      setStorage(StorageKeyType.ExpiryTime, expiryTime || "");

      navigate("/");
    } else {
      // Handle error
      navigate("/sign-in");
    }
  }, []);

  return <div>Logging in...</div>;
}

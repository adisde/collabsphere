import { useEffect, useState } from "react";
import { authuser } from "../hooks/auth/authuser";
import { CircleAlert } from "lucide-react";

export default function AuthUser() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [showMsg, setMsg] = useState("Authenticating.");

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (!token) {
        if (!mounted) return;
        setLoading(false);
        setMsg("Invalid or expired link. Log in again.");
        return;
      }

      try {
        const result = await authuser(token);

        if (!mounted) return;

        setLoading(false);
        setMsg(result.message || "Unable to verify your account.");
      } catch (err: any) {
        if (!mounted) return;
        setLoading(false);
        setMsg("Something went wrong. Try again.");
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-fit mx-auto mt-28 text-center flex flex-col items-center gap-2 p-2">
      {loading && (
        <div className="w-10 h-10 border-2 rounded-full animate-spin border-t-transparent border-black dark:border-white dark:border-t-transparent" />
      )}

      <div className="flex flex-col items-center gap-2">
        {!loading && <CircleAlert className="w-6 h-6" />}
        <p className="text-center">{showMsg}</p>
      </div>
    </div>
  );
}

// /verify-email.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const token = searchParams.get("token");
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/verify-email?token=${token}`);
        if (res.ok) setStatus("verified");
        else setStatus("error");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, []);

  return (
    <div className="text-center p-8">
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "verified" && <p className="text-green-600">Email verified! You can now log in.</p>}
      {status === "error" && <p className="text-red-600">Verification failed. The link may be invalid or expired.</p>}
    </div>
  );
};

export default VerifyEmail;

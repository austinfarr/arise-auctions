import { useState } from "react";
import supabase from "../../lib/supabase";

const SimpleLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
      setIsOtpSent(true);
      console.log("OTP sent to phone:", phoneNumber);
    } catch (error) {
      setError("Error during sign up/login: " + error.message);
      console.error("Error during sign up/login:", error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { user, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
      });
      if (error) throw error;
      console.log("Successfully signed in:", user);
    } catch (error) {
      setError("Error verifying OTP: " + error.message);
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div>
      <h1>Simple Login Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isOtpSent ? (
        <form onSubmit={handlePhoneSubmit}>
          <label>
            Phone Number:
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <label>
            Enter OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </label>
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default SimpleLoginPage;

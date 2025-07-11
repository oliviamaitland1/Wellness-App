import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Adjust the import path as necessary
import { useRouter } from 'next/router';


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ // eslint-disable-next-line @typescript-eslint/no-unused-vars 
      email,
      password,
    });
    if (error) { setErrorMsg(error.message); }
    else {
      setEmail("");
      setPassword("");
      setErrorMsg("");
      router.push("/dashboard"); // Redirect to home page after successful login
    }
  };


  return (
    <form onSubmit={handleLogin} className="login-form">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </form>
  );
}
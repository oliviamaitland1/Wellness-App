"use client";
import {useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import {useRouter} from 'next/router';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Attempting login...");

    try {
      console.log("supabase.auth:", supabase.auth);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    
      if (error) {
        console.error("Supabase Error:", error.message);
        toast.error(error.message || "An unexpected error occurred.");
      } else {
        console.log("Login successful:");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("Unexpected Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form" style={{maxWidth: "400px", margin: "0 auto"}}>
      <h1>Login</h1>
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
      {errorMsg && <p style={{color: "red", marginTop: "4px"}}>{errorMsg}</p>}
      <button type="submit">Login</button>
      <ToastContainer />
    </form>
  );
}
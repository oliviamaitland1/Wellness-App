import LoginForm from "./loginform";
import Link from "next/link";
import {useRouter} from 'next/router';

export default function LoginPage() {
    const router = useRouter();
   
    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h1>Login</h1>
            <LoginForm />
            <Link href="/register">Don't have an account? Register here</Link>
           <Link href="/"><br />Back to Home</Link>
        </div>
    )
}
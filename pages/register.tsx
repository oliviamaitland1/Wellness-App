import RegisterForm from "./registerform";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1>Register</h1>
            <RegisterForm />
            <Link href="/">Back to Home</Link>
        </div>
    );
}
import React from "react";
import Link from "next/link"; // HOME PAGE
// This is the main entry point for the wellness app, providing a welcome message and a link


export default function HomePage() {
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Welcome to the Wellness App</h1>
            <p>Your journey to better health starts here.</p>
            <p>Explore our features and start tracking your wellness today!</p>
            <Link href="/login"> <button className="text-blue-500 hover:underline">
                Login
            </button>
            </Link>
            <Link href="/register"> <button className="text-blue-500 hover:underline">
              Join
            </button>
            </Link>
            <p>Already have an account? <Link href="/login">Login here</Link>.</p>
            <p>New to the app? <Link href="/register">Register now</Link>.</p>
        </div>
    );
    
}
import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Adjust the import path as necessary
import { useRouter } from 'next/router';

    export default function RegisterForm() {
        const router = useRouter();
        const [name, setName] = useState("");
        const [age, setAge] = useState("");
        const [pronouns, setPronouns] = useState("");
        const [wellnessGoal, setWellnessGoal] = useState("");
        const [userName, setUserName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [reminders, setReminders] = useState("False");
        const [theme, setTheme] = useState("");
        const [successMessage, setSuccessMessage] = useState("");

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            // Handle registration logic here
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name,
                age,
                pronouns,
                wellnessGoal,
                userName,
                reminders,
                theme,
            }
        }
    }); 
        if (error) {
            console.error("Error signing up:", error.message);
        } else {
            console.log("User registered successfully:", data);
            setSuccessMessage("Registration successful! Welcome, my friend!");
        setTimeout (() => {
            router.push('/');
        }, 2000);
        };
        setName("");
        setAge("");
        setPronouns("");
        setWellnessGoal("");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setReminders("");
        setTheme("");

            console.log("Name:", name);
            console.log("Age:", age);
            console.log("Pronouns:", pronouns);
            console.log("Wellness Goal:", wellnessGoal);
            console.log("Username:", userName);
            console.log("Email:", email);
            console.log("Password:", password);
            console.log("Confirm Password:", confirmPassword);
            console.log("Reminders:", reminders);
            console.log("Theme:", theme);
        }

        return (
            <main>
                {successMessage && (
                    <div style={{ marginBottom: "20px", color: "green" }} className="success-message">
                        <strong>{successMessage}</strong>
                    </div>
                )}
            <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                    </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }} />  
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="pronouns">Pronouns:</label>
                    <select
                        id="pronouns"
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
                        <option value="">Select your pronouns</option>
                        <option value="he/him">He/Him</option>
                        <option value="she/her">She/Her</option>
                        <option value="they/them">They/Them</option>
                        <option value="other">Other</option>
                        <option value="preferNotToSay">Prefer Not to Say</option>
                        </select>
                    </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="wellnessGoal">Wellness Goal:</label>
                    <select
                        id="wellnessGoal"
                        value={wellnessGoal}
                        onChange={(e) => setWellnessGoal(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
                        <option value="">Select a goal</option>
                        <option value={"improvedFitness"}>Improved Fitness</option>
                        <option value="stressRelief">Stress Relief</option>
                        <option value="improvedNutrition">Improved Nutrition</option>
                        <option value = "overallHealth">Overall Health</option>
                        </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                <label htmlFor="userName">Username:</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}/>
                </div>
                <div style={{ marginBottom: "15px" }}>  
                <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}/>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="reminders">Reminders:</label>
                    <input
                        type="checkbox"
                        checked={reminders === "daily"}
                        onChange={(e) => setReminders(e.target.checked ? "daily" : "")}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    /> Send me daily reminders!! </div>
                    <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="theme">Theme:</label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
                        <option value="">Select a theme</option>
                        <option value="softGlow">Soft Glow</option>
                        <option value="mysticBaddie">Mystic Baddie</option>
                        <option value="groundedQueen">Grounded Queen</option>
                        </select>
                    </div>
                <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
                    Register </button>
                    </form>
                    </main>
        );
}
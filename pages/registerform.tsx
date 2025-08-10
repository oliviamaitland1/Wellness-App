import {useState} from "react";
import {supabase} from "../lib/supabaseClient"; 
import {useRouter} from 'next/router';

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
    const isPasswordTooShort = password.length > 0 && password.length < 8;
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        if (!name || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        }
        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return false;
        }
        if (!/\d/.test(password) || !/[A-Z]/.test(password)) {
            setErrorMessage("Password must contain at least one number and one uppercase letter.");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateForm()) return;

        try {
            const {error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        age,
                        pronouns,
                        wellnessGoal,
                        userName,
                        reminders,
                    }
                }
            });

            if (error) {
                setErrorMessage("Registration failed. Please try again.");
            } else {
                setSuccessMessage("Registration successful! Please check your email to confirm your account.");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch {
            setErrorMessage("An unexpected error occurred. Please try again later.");
          }
    };

    return (
        <main>
            {successMessage && (
                <div style={{marginBottom: "20px", color: "green"}} className="success-message">
                    <strong>{successMessage}</strong>
                </div>
            )}
            <form onSubmit={handleRegistration} style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div style={{marginBottom: "15px"}}>
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
                <div style={{marginBottom: "15px"}}>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }} />  
                </div>
                <div style={{marginBottom: "15px"}}>
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
                <div style={{marginBottom: "15px"}}>
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
                <div style={{marginBottom: "15px"}}>
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
                    <div style={{marginBottom: "15px"}}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}/>
                </div>
                <div style={{marginBottom: "15px"}}>  
                <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                    {isPasswordTooShort && (
                        <p style={{ color: "red" }}>Password must be at least 8 characters long.</p>
                    )}
                </div>
                <div style={{marginBottom: "15px" }}>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}/>
                </div>
                <div style={{marginBottom: "15px" }}>
                    <label htmlFor="reminders">Reminders:</label>
                    <input
                        type="checkbox"
                        checked={reminders === "daily"}
                        onChange={(e) => setReminders(e.target.checked ? "daily" : "")}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    /> Send me daily reminders!! </div>
                    <div style={{marginBottom: "15px"}}>
                    </div>
                <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
                    Register </button>
                    {errorMessage && <p style={{ color: "red", marginTop: "4px" }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: "green", marginTop: "4px" }}>{successMessage}</p>}
                    </form>
                    </main>
    );
}
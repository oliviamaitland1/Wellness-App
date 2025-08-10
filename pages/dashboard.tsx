import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Lottie from 'lottie-react';
import squatReachData from '../public/Squat Reach.json';
import {v4 as uuidv4} from 'uuid';
import AppHeader from '../components/AppHeader';
import withAuth from '../components/ProtectedRoute';


function Dashboard() {
  const router = useRouter();
  const [mood, setMood] = useState("");
  const [waterIntake, setWaterIntake] = useState(new Array(8).fill(false));
  const [moodLoading, setMoodLoading] = useState(true);
  const [meditationOpen, setMeditationOpen] = useState(false);
  

    const [mealName, setMealName] = useState ('')
    const [calories, setCalories] = useState ('')
    const [type, setType] = useState ('')
    const [message, setMessage] = useState ('')
    const [fat, setFat] = useState ('')
    const [protein, setProtein] = useState ('')
    const [carbs, setCarbs] = useState ('')
    type Meal = {
      mealId: string;
      mealName: string;
      calories: number;
      type: string;
      date: string;
      macros: { fat: number; protein: number; carbs: number };
    };
    const [savedMeals, setSavedMeals] = useState<Meal[]>([]);



    const handleAddMeal = async (e: React.FormEvent) => {
      e.preventDefault();
      const {data: {user}, error: userError} = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User retrieval error:', userError?.message);
        return;
      }

      const newMeal = {
        mealId: uuidv4(),
        mealName,
        calories: parseInt(calories),
        type,
        date: new Date().toISOString().split('T')[0],
        macros: {
          fat: parseInt(fat),
          protein: parseInt(protein),
          carbs: parseInt(carbs)
        }
      };
      
      const {data: existingRow, error: fetchError} = await supabase
      .from('user_settings')
      .select('nutrition_log')
      .eq('user_id', user.id)
      .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Fetch error:', fetchError.message);
        return;
      }
      const currentLog = existingRow?.nutrition_log || [];
      const updatedLog = [...currentLog, newMeal];

      if (existingRow) {
        const { error: updateError } = await supabase
        .from('user_settings')
        .update({nutrition_log: updatedLog})
        .eq('user_id', user.id);

        if (updateError) {
          console.error('Update error:', updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
        .from('user_settings')
        .insert({user_id: user.id, nutrition_log: [newMeal]});

        if (insertError) {
          console.error('Insert error:', insertError.message);
        }
      }

      setMessage('Meal added successfully!');
      setMealName('');
      setCalories('');
      setType('');
      setFat('');
      setProtein('');
      setCarbs('');
    }



  const meditationVariants = {
    closed: { height: 0, opacity: 0, overflow: 'hidden' },
    open: { height: 'auto', opacity: 1, overflow: 'visible', transition: { duration: 0.5 } }
  };

  const toggleMeditation = () => {
    setMeditationOpen(!meditationOpen);
  };

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    }

    checkUser();
  }, [router]);
  useEffect(() => {
    async function fetchWaterIntake() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User fetch error:", userError?.message);
        return;
      }
  
      const { data, error } = await supabase
        .from('user_settings')
        .select('water_intake')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        console.error("Fetch water intake error:", error.message);
      }
  
      if (data?.water_intake) {
        setWaterIntake(data.water_intake);
      }
    }
  
    fetchWaterIntake();
  }, []);
  
  useEffect(() => {
    async function fetchMood() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error } = await supabase
          .from('user_settings')
          .select('mood')
          .eq('user_id', userData.user.id)
          .single();
        if (error) {
          console.error("Fetch mood error:", error.message);
        }
      } else if (data?.mood) {
        setMood(data.mood);
      }
    }
    fetchMood();
    setMoodLoading(false);
  }, []);

  const fetchSavedMeals = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('nutrition_log')
      .single();

    if (error) {
      console.error('Error fetching saved meals:', error.message);
      return [];
    }

    return data?.nutrition_log || [];
  };

  useEffect(() => {
    fetchSavedMeals().then(meals => setSavedMeals(meals));
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/login');
    }
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User fetch error:", userError?.message);
      return;
    }
  
    const userId = user.id;
  
    const { data: existingRow, error: fetchError } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('user_id', userId)
      .single();
  
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Fetch error:", fetchError.message);
      return;
    }
  
    if (existingRow) {
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ mood: selectedMood })
        .eq('user_id', userId);
  
      if (updateError) {
        console.error("Update error:", updateError.message);
      }
    } else {
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert({ user_id: userId, mood: selectedMood });
  
      if (insertError) {
        console.error("Insert error:", insertError.message);
      }
    }
  };
  
  const toggleWaterIntake = async (index) => {
    const updatedIntake = waterIntake.map((item, i) => i === index ? !item : item);
    setWaterIntake(updatedIntake);
  
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('user_settings')
        .update({ water_intake: updatedIntake })
        .eq('user_id', user.id);
      if (error) {
        console.error('Error updating water intake:', error.message);
      }
    }
  };  

  return (
    <main className="max-w-6xl space-y-6 mx-auto p-6 bg-[var(--bg)]  grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col absolute top-4 left-1/2 transform -translate-x-1/2">
      <p className="text-2xl font-[bungee] text-purple-300 text-3xl font-semibold animate-pulse ">WELCOME TO YOUR WELLNESS HUB 🤍</p>
      </div>
      <div className="absolute top-4 right-4">
      <AppHeader />
      </div>
      <div className='flex flex-col'>
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full w-fit h-fit inline-block mt-18">
    <div className="bg-gradient-to-r from-orange-200 via-white to-pink-200 bg-clip-text text-transparent italic font-medium animate-pulse">
    <p className="text-sm font-[tektur] text-white">⭐Wellness Tip of The Day⭐<br></br> Take 5 minutes to breathe deeply today.</p>
      <p className="text-sm font-[tektur] text-white"> 💗Affirmation of The Day💗<br></br>
      I am glowing from the inside out.</p>
    </div>
    </div>
    <div className="p-4 border rounded-lg shadow-md bg-green-100 max-w-md mt-8 p-4 rounded-xl shadow-md">
    <h2 className="text-lg font-bold font-[tektur] mb-3 text-purple-700">🍽️ Nutrition Log</h2>
    <form onSubmit={handleAddMeal} className="space-y-3">
      <input
        type="text"
        placeholder="Meal Name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Meal Type</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </select>
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Carbs (g)"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Fat (g)"
          value={fat}
          onChange={(e) => setFat(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full h-fit w-fit transition duration-200"
      >
        Add Meal
      </button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </form>
  </div>
  <div className="flex flex-col space-y-4 mt-8">
    <h2 className="inline-block px-3 py-1 w-fit h-fit rounded-lg bg-white/80 dark:bg-white/20 text-[var(--text)] dark:text-white mb-4 p-4 rounded-xl shadow-md font-bold font-[tektur]">Saved Meals</h2>
    {savedMeals.length === 0 ? (
      <p> No saved meals found.</p>
    ) : (
      <ul className="space-y-2">
        {savedMeals.map((meal) => (
          <li key={meal.mealId} className="bg-white p-4 rounded shadow p-4 rounded-xl shadow-md max-w-md">
            <h3 className="font-bold font-[tektur]">{meal.mealName}</h3>
            <p>Calories: {meal.calories}</p>
            <p>Type: {meal.type}</p>
            <p>Date: {meal.date}</p>
            <p>Macros:</p>
            <ul>
              <li>Protein: {meal.macros.protein}g</li>
              <li>Carbs: {meal.macros.carbs}g</li>
              <li>Fat: {meal.macros.fat}g</li>
            </ul>
          </li>
        ))}
      </ul>
    )}
  </div>
      </div>
      <div className="grid grid-cols-2 gap-2 space-y-6 mt-12 w-fit h-fit">
      {!moodLoading && (
      <div className="flex justify-around items-center bg-purple-100 p-4 rounded-full shadow-md mt-6">
        <p className="text-sm font-[tektur]">What is your mood today, bestie?</p>
        <button className={`text-2xl ${mood === 'happy' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('happy')} aria-label="happy">😊</button>
        <button className={`text-2xl ${mood === 'neutral' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('neutral')} aria-label="neutral">😐</button>
        <button className={`text-2xl ${mood === 'sad' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('sad')} aria-label="sad">😢</button>
        <button className={`text-2xl ${mood === 'angry' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('angry')} aria-label="angry">😡</button>
      </div>
      )}
      <div className="flex justify-around items-center bg-blue-100 p-4 rounded-full shadow-md mt-6">
       <p className="text-sm font-[tektur]">How many cups of water have you had today?</p>
        {[...Array(8)].map((_, i) => (
          <button
          key={i}
          style={{
            backgroundColor: waterIntake[i] ? "var(--accent)" : "var(--card)",
            color: waterIntake[i] ? "#fff" : "var(--text)",
            border: waterIntake[i] ? "none" : "1px solid #D1D5DB"
          }}
          className="w-6 h-6 rounded-full transition"
          onClick={() => toggleWaterIntake(i)}
        ></button>
        ))}
      </div>
      <div className ="flex flex-row gap-4 justify-center items-center">
      <div className="rounded-full w-fit h-fit p-4 text-center mt-2 ml-4">
       <h2 className="text-lg font-bold text-purple-700 mb-2 animate-pulse font-[tektur]">Stretch of the Day 🧘🏽‍♀️</h2>
        <Lottie
          animationData={squatReachData}
          loop={true}
          style={{ width: '160px', height: '160px', margin: '0 auto' }}
        />
        <p className="text-sm text-gray-600 mt-2 italic animate-pulse font-[tektur]">Try a gentle side stretch!</p>
      </div>
      </div>
      <div className="relative flex flex-col items-start">
      <button onClick={toggleMeditation} className="mt-8 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full h-fit w-fit transition duration-200 ml-12 font-[tektur]">
        Start a Meditation
      </button>
      <motion.div
        className=" bg-white/80 rounded-lg shadow-md p-4 mt-4 mb-6 p-4 rounded-xl shadow-md"
        initial="closed"
        animate={meditationOpen ? "open" : "closed"}
        variants={meditationVariants}
      >
        <p className="text-center mb-4 font-[tektur]">I am safe, I am grounded, I am loved.</p>
        <audio controls className="w-full">
          <source src="https://udhqfoqejatqmzakiliv.supabase.co/storage/v1/object/public/meditations//mixkit-serene-view-443.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </motion.div>
      </div>
      </div>
      <div className="inline-block px-3 py-1 rounded-lg bg-white/80 dark:bg-white/20 text-[var(--text)] dark:text-white mb-4 w-fit h-fit font-[tektur] ml-12">
        🌔 Current Moon Phase: Waxing Gibbous
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
      <Link href="/wellness-entry"><div className="bg-[var(--accent)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg">
      Wellness Entry
      </div></Link>
      <Link href="/progress">
        <div className="bg-[var(--accent)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg">
          Progress Page
        </div>
      </Link>
      <Link href="/settings"><div className="bg-[var(--accent)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg">
        Settings
      </div></Link>
      <button onClick={handleLogout} className="bg-[var(--accent)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg">
        Logout
      </button>

      </div>
    </main>
  );
}
  
export default withAuth(Dashboard);

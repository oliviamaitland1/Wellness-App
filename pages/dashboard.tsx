import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Music, Dumbbell, BookOpen, Utensils, Smile, Heart } from 'lucide-react';
import Link from 'next/link';
import Lottie from 'lottie-react';
import squatReachData from '../public/Squat Reach.json';

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [mood, setMood] = useState("");
  const [waterIntake, setWaterIntake] = useState(new Array(8).fill(false));
  const [moodLoading, setMoodLoading] = useState(true);
  const [meditationOpen, setMeditationOpen] = useState(false);



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
      } else {
        setUserEmail(user.email || "");
        setUserName(user.user_metadata.full_name || "");
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('mood')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setMood(data.mood);
        }
      }
    }
    fetchMood();
    setMoodLoading(false);
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
    <main className="max-w-6xl space-y-6 mx-auto p-6 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col absolute top-4 left-1/2 transform -translate-x-1/2">
      <p className="text-2xl font-[bungee] text-purple-300 text-3xl font-semibold animate-pulse">WELCOME TO YOUR WELLNESS HUB 🤍</p>
      </div>
      <div className='flex flex-col'>
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full w-fit h-fit inline-block mt-18">
     <p className="text-sm font-[tektur] text-white">Wellness Tip of The Day⭐</p>
    <div className="bg-gradient-to-r from-orange-200 via-white to-pink-200 bg-clip-text text-transparent italic font-medium animate-pulse">
      Take 5 minutes to breathe deeply today.
    </div>
    </div>
    <button onClick={toggleMeditation} className="mt-8 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full h-fit w-fit transition duration-200">
        Start a Meditation
      </button>
      <motion.div
        className="bg-white/80 rounded-lg shadow-md p-4 mt-4"
        initial="closed"
        animate={meditationOpen ? "open" : "closed"}
        variants={meditationVariants}
      >
        <p className="text-center mb-4">I am safe, I am grounded, I am loved.</p>
        <audio controls className="w-full">
          <source src="https://udhqfoqejatqmzakiliv.supabase.co/storage/v1/object/public/meditations//mixkit-serene-view-443.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </motion.div>
      </div>
      <div className="grid grid-cols-2 space-y-6 mt-6">
      {!moodLoading && (
      <div className="flex justify-around items-center p-4 m-4 bg-purple-100 rounded-xl shadow-md">
        <p className="text-sm font-[tektur]">What's your mood today, bestie?</p>
        <button className={`text-2xl ${mood === 'happy' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('happy')} aria-label="happy">😊</button>
        <button className={`text-2xl ${mood === 'neutral' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('neutral')} aria-label="neutral">😐</button>
        <button className={`text-2xl ${mood === 'sad' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('sad')} aria-label="sad">😢</button>
        <button className={`text-2xl ${mood === 'angry' ? 'ring-4 ring-pink-300 shadow-lg' : ''}`} onClick={() => handleMoodSelect('angry')} aria-label="angry">😡</button>
      </div>
      )}
      <div className="flex justify-around items-center p-4 m-4 bg-blue-100 rounded-xl shadow-md">
       <p className="text-sm font-[tektur]">How many cups of water have you had today?</p>
        {[...Array(8)].map((_, i) => (
          <button key={i} className={`w-6 h-6 rounded-full ${waterIntake[i] ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => toggleWaterIntake(i)}></button>
        ))}
      </div>
      <div className="rounded-full w-fit h-fit p-4 text-center mt-6">
       <h2 className="text-lg font-bold text-purple-700 mb-2">Stretch of the Day 🧘🏽‍♀️</h2>
        <Lottie
          animationData={squatReachData}
          loop={true}
          style={{ width: '160px', height: '160px', margin: '0 auto' }}
        />
        <p className="text-sm text-gray-600 mt-2 italic">Try a gentle side stretch to loosen your spine!</p>
      </div>
      </div>
      <div className="flex flex-col absolute bottom-0 right-4">
      <div className="rounded-full mt-8 w-fit h-fit animate-pulse shadow-md shadow-pink-300 bg-gradient-to-r from-pink-300 to-orange-200 p-4 m-4 text-lg font-[tektur] text-white">
         Affirmation of The Day💗<br></br>
         "I am glowing from the inside out."
        </div>
      <div className="text-sm italic">
        🌔 Current Moon Phase: Waxing Gibbous
      </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4 absolute bottom-4">
      <Link href="/progress">
        <div className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg">
          Progress Page
        </div>
      </Link>
      <Link href="/settings"><div className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg">
        Settings
      </div></Link>
      <button onClick={handleLogout} className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg">
        Logout
      </button>
      </div>
    </main>
  );
}
  
export default Dashboard;
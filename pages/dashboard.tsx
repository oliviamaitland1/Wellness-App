import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Music, Dumbbell, BookOpen, Utensils, Smile, Heart } from 'lucide-react';
import Link from 'next/link';

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

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


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/login');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
  <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Wellness Dashboard, {userName || 'friend'}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.a
          href="#"
          className="relative block bg-purple-300 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
         <Link href="/wellness-entry">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 hover:opacity-50 transition-opacity"></div>
         <BookOpen className="w-6 h-6 mb-2 bg-pink-300" />
         <h2 className="text-lg font-semibold">Wellness Entry</h2>
         <p>Log your daily wellness journey.</p>
         </Link>
        </motion.a> 
        <motion.a
          href="#"
          className="relative block p-6 bg-indigo-500 rounded-lg shadow-md shadow-pink-300 hover:shadow-lg hover:scale-105 transition-transform overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 hover:opacity-50 transition-opacity"></div>
          <Heart className="w-6 h-6 mb-2 bg-pink-300" />
          <h2 className="text-lg font-semibold">Water Tracker</h2>
          <p>Track your daily water intake.</p>
        </motion.a>
        <motion.a
          href="#"
          className="relative block p-6 bg-rose-500 rounded-lg shadow-md shadow-pink-300 hover:shadow-lg hover:scale-105 transition-transform overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 hover:opacity-50 transition-opacity"></div>
          <Dumbbell className="w-6 h-6 mb-2 bg-pink-300" />
          <h2 className="text-lg font-semibold">Fitness Log</h2>
          <p>Record your workouts and progress.</p>
        </motion.a>
        <motion.a
          href="#"
          className="relative block p-6 bg-amber-300 rounded-lg shadow-md shadow-pink-300 hover:shadow-lg hover:scale-105 transition-transform overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 hover:opacity-50 transition-opacity"></div>
          <Utensils className="w-6 h-6 mb-2 bg-pink-300" />
          <h2 className="text-lg font-semibold">Nutrition</h2>
          <p>Monitor your dietary habits.</p>
        </motion.a>
        <motion.a
          href="#"
          className="relative block p-6 bg-emerald-500 rounded-lg shadow-md shadow-pink-300 hover:shadow-lg hover:scale-105 transition-transform overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 hover:opacity-50 transition-opacity"></div>
          <Smile className="w-6 h-6 mb-2 bg-pink-300" />
          <h2 className="text-lg font-semibold">Meditation & Relaxing</h2>
          <p>Find peace and mindfulness.</p>
        </motion.a>
      </div>
      <motion.div
        className="p-6 bg-gray-200 rounded-lg mb-8"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-semibold">Coming Soon: Your Stats</h2>
        <p>Placeholder for future analytics and statistics.</p>
      </motion.div>
      <button onClick={handleLogout} className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
        Logout
      </button>
    </div>
  );
}
  
export default Dashboard;
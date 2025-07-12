import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import WellnessEntryForm from "./WellnessEntryForm";

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email || "");
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

  return (
  <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Wellness Dashboard, {userEmail}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="#" className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
          <h2 className="text-lg font-semibold">Wellness Entry</h2>
          <p>Log your daily wellness journey.</p>
        </a>
        <a href="#" className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
          <h2 className="text-lg font-semibold">Water Tracker</h2>
          <p>Track your daily water intake.</p>
        </a>
        <a href="#" className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
          <h2 className="text-lg font-semibold">Fitness Log</h2>
          <p>Record your workouts and progress.</p>
        </a>
        <a href="#" className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
          <h2 className="text-lg font-semibold">Nutrition</h2>
          <p>Monitor your dietary habits.</p>
        </a>
        <a href="#" className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
          <h2 className="text-lg font-semibold">Meditation & Relaxing</h2>
          <p>Find peace and mindfulness.</p>
        </a>
      </div>
      <div className="p-6 bg-gray-200 rounded-lg mb-8">
        <h2 className="text-lg font-semibold">Coming Soon: Your Stats</h2>
        <p>Placeholder for future analytics and statistics.</p>
      </div>
      <WellnessEntryForm />
      <button onClick={handleLogout} className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import withAuth from "../components/ProtectedRoute";
import { supabase } from '../lib/supabaseClient';
import router from 'next/router';

function Settings() {
  const [theme, setTheme] = useState('light');

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) return;
      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('user_settings')
        .select('profile_url, theme')
        .eq('user_id', userId)
        .single();

      if (!error) {
        if (data?.profile_url) {
          setPreview(data.profile_url);
        }
        if (data?.theme) {
          setTheme(data.theme);
          applyTheme(data.theme);
        } else {
          const storedTheme = localStorage.getItem('appTheme');
          if (storedTheme) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
          } else {
            applyTheme('light');
          }
        }
      }
    })();
  }, []);

  const applyTheme = (theme: string) => {
    document.documentElement.classList.remove('light', 'dark', 'lavender');
    document.documentElement.classList.add(theme);
    localStorage.setItem('appTheme', theme);
  };

  const handleThemeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value;
    setTheme(newTheme);
    applyTheme(newTheme);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return;
    const userId = userData.user.id;

    const { error: updateError } = await supabase
      .from('user_settings')
      .update({ theme: newTheme })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating theme:', updateError.message);
    }
  };

  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadMsg('');
    setIsError(false);

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setIsError(true);
      setUploadMsg('Please choose an image file.');
      event.target.value = '';
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setIsError(true);
      setUploadMsg(userError?.message || 'Not authenticated.');
      event.target.value = '';
      return;
    }
    const userId = userData.user.id;

    try {
      const safeName = file.name.replace(/\s+/g, '_');
      const path = `${userId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('profile-pics')
        .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from('profile-pics').getPublicUrl(path);
      const publicUrl = pub?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL.');

      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ profile_url: publicUrl })
        .eq('user_id', userId);
      if (updateError) throw updateError;

      setPreview(publicUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsError(false);
      setUploadMsg('Profile picture updated!');
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err: unknown) {
        setIsError(true);
      
        if (err instanceof Error) {
          setUploadMsg(`${err.name || 'Error'}: ${err.message || 'Upload failed.'}`);
        } else {
          setUploadMsg('Upload failed.');
        }
      
        event.target.value = '';
      }
      
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <select
          value={theme}
          onChange={handleThemeChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="lavender">Lavender</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          ref={fileInputRef}
          className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
        />
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="mt-4 w-32 h-32 rounded-full object-cover"
          />
        )}
      </div>

      {uploadMsg && (
        <p className={`${isError ? 'text-red-600' : 'text-green-600'} mt-2`}>
          {uploadMsg}
        </p>
      )}
      <div className="bg-[var(--accent)] hover:bg-[var(--accent)] fixed bottom-4 right-4 text-white py-2 px-4 rounded-lg">
        <button onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
      </div>
      
    </div>
  );
}

export default withAuth(Settings);

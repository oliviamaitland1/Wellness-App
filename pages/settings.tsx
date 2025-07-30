import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import withAuth from "../components/ProtectedRoute";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function Settings() {
    const [theme, setTheme] = useState('light');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilePic = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData || !userData.user) {
                console.error('User retrieval error:', userError?.message);
                return;
            }
            const userId = userData.user.id;
            const { data, error } = await supabase
                .from('user_settings')
                .select('profile_url')
                .eq('user_id', userId)
                .single();
            if (data && data.profile_url) {
                setPreview(data.profile_url);
            }
        };
        fetchProfilePic();
    }, []);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            setProfilePic(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleProfilePicUpload = async () => {
        if (!profilePic) return;
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData || !userData.user) {
            console.error('User retrieval error:', userError?.message);
            return;
        }
        const userId = userData.user.id;
        const fileName = `${userId}_${Date.now()}`;
        const { data, error } = await supabase.storage
            .from('profile-pics')
            .upload(fileName, profilePic);
        if (error) {
            console.error('Upload error:', error.message);
            return;
        }
        const { data: urlData, error: urlError } = supabase.storage
            .from('profile-pics')
            .getPublicUrl(fileName);
        if (urlError) {
            console.error('URL error:', urlError.message);
            return;
        }
        const publicUrl = urlData.publicUrl;
        const { error: upsertError } = await supabase
            .from('user_settings')
            .upsert({ user_id: userId, profile_url: imageUrl });
        if (upsertError) {
            console.error('Upsert error:', upsertError.message);
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
                    className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                />
                {preview && (
                    <img src={preview} alt="Profile Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />
                )}
                <button
                    onClick={handleProfilePicUpload}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default withAuth(Settings);

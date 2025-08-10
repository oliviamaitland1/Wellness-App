import { supabase } from '../lib/supabaseClient';

export async function uploadAvatarAndSave(file: File): Promise<string | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
    if (uploadError) throw new Error('Error uploading file');

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    if (!publicUrlData) throw new Error('Error getting public URL');

    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('user_settings')
      .update({ profile_url: publicUrl })
      .eq('user_id', user.id);
    if (updateError) throw new Error('Error updating profile URL');

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadAvatarAndSave:', error);
    return null;
  }
}

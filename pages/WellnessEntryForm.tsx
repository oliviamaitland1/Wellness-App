import React from 'react';
import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import sanitizeInput from '../lib/lib/sanitizeInput.js'; 


function WellnessEntryForm() {
    interface Entry { 
        id: string;
        entry: string;
        created_at: string;
    }
    
    const [entry, setEntry] = useState('')
    const maxCharacters = 255;
    const [message, setMessage] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    // Handle wellness entry logic here
   const fetchEntries = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    const { data, error: fetchError } = await supabase
        .from('wellness_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', {ascending: false});

    if (fetchError) {
        console.error('Error fetching entries:', fetchError.message);
        setMessage('Failed to fetch entries. Please try again.');
    } else {
        console.log('Entries fetched successfully:', data);
        setMessage('Entries fetched successfully!');
        setEntries(data || []); // Ensure setEntries is always provided with an array
    }
 };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedInput = sanitizeInput(entry);
        const {error: sanitizeError} = await sanitizeInput(entry);
        if (sanitizeError) {
            console.error('Error sanitizing input:', sanitizeError.message);
        } else {
            console.error('Input sanitized successfully:', sanitizedInput);
        }
        const { data: { user }, error } = await supabase.auth.getUser();
        const { data, error: submitError } = await supabase
        .from('wellness_entries')
        .insert([{ entry, user_id: user?.id }]);
    if (submitError) {
        console.error('Error submitting entry:', submitError.message);
        setMessage('Failed to submit entry. Please try again.');
    } else {
        console.log('Entry submitted successfully:', data);
        setMessage('Entry submitted successfully!');
        setEntry('');
        fetchEntries(); // Refresh entries after submission
    }
    console.log('Wellness Entry:', entry);
};

return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wellness Entry Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Journal your wellness journey!!:</label>
          <textarea 
            className="w-full p-2 border rounded" 
            rows={4}
            cols={50}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            maxLength={maxCharacters + 1}
            placeholder='Write about your wellness journey here...'
            required
          />
        </div>
        {entry.length > maxCharacters && ( 
                        <p style={{color:"red", marginTop: '4px'}}>
                            You have exceeded the maximum character limit of {maxCharacters} characters.
                        </p>
                    )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save Entry</button>
        {message && <p>{message}</p>}
      </form>
      <h3>Recent Entries:</h3>
        {
            entries.length === 0 ? (
                <p>No entries found. Start your wellness journey by adding an entry!</p>
            ) : (
            <ul>
                {entries.map((item) => (
                    <li key={item.id}>
                        <p>{item.entry}</p>
                        <small>{item.created_at ? new Date(item.created_at).toLocaleString() : 'No date available'}</small>
                        <hr />
                    </li>
                ))}
            </ul>
        )
        }
    </div>
  );
}

export default WellnessEntryForm;

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import sanitizeInput from '../lib/lib/sanitizeInput.js';
import Link from 'next/link';

type EntryRow = {
  id: string;
  user_id: string;
  entry: string;
  created_at: string;
};

function decodeEntities(s: string) {
  if (!s) return '';
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

export default function WellnessEntryForm() {
  const [energy, setEnergy] = useState<number>(3);
  const [grat1, setGrat1] = useState<string>('');
  const [grat2, setGrat2] = useState<string>('');
  const [grat3, setGrat3] = useState<string>('');
  const [journal, setJournal] = useState<string>('');
  const [tagsText, setTagsText] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<string>('');
  const [waterCups, setWaterCups] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [entries, setEntries] = useState<EntryRow[]>([]);
  const clientTimestampISO = useMemo(() => new Date().toISOString(), []);

  const parseTags = (raw: string): string[] => {
    const items = raw.split(/[,\s]+/).map(t => t.trim()).filter(Boolean);
    return Array.from(new Set(items));
  };

  const makePayload = () => ({
    energy,
    gratitude: [sanitizeInput(grat1), sanitizeInput(grat2), sanitizeInput(grat3)],
    journal: sanitizeInput(journal),
    tags: parseTags(tagsText),
    sleep_hours: sleepHours ? Number(sleepHours) : null,
    water_cups: waterCups ? Number(waterCups) : null,
    client_timestamp: clientTimestampISO,
    version: 1,
  });

  const fetchEntries = async () => {
    const { data: userWrap, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userWrap?.user?.id) {
      setMessage('Could not get user.');
      return;
    }
    const { data, error: fetchError } = await supabase
      .from('wellness_entries')
      .select('*')
      .eq('user_id', userWrap.user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching entries:', fetchError.message);
      setMessage('Failed to fetch entries.');
    } else {
      setEntries(data || []);
      setMessage('');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setToast('');

    try {
      const { data: userWrap, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userWrap?.user?.id) {
        setSaving(false);
        setMessage('Not logged in.');
        return;
      }

      const payload = makePayload();
      const { error: insertErr } = await supabase
        .from('wellness_entries')
        .insert([{ entry: JSON.stringify(payload), user_id: userWrap.user.id }]);

      if (insertErr) {
        console.error(insertErr);
        setMessage('Failed to submit entry.');
      } else {
        await fetchEntries();
        setGrat1('');
        setGrat2('');
        setGrat3('');
        setJournal('');
        setTagsText('');
        setSleepHours('');
        setWaterCups('');
        setEnergy(3);
        setToast('Entry saved!');
        setTimeout(() => setToast(''), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const rows = entries.map((row) => {
      let parsed: any = null;
      try {
        parsed = JSON.parse(row.entry);
      } catch {
        parsed = {
          energy: 'N/A',
          gratitude: [],
          journal: row.entry || 'N/A',
          tags: [],
          sleep_hours: 'N/A',
          water_cups: 'N/A',
          client_timestamp: 'N/A',
        };
      }
      return {
        id: row.id,
        created_at: row.created_at || 'N/A',
        energy: parsed.energy ?? 'N/A',
        gratitude_1: parsed.gratitude?.[0] ?? 'N/A',
        gratitude_2: parsed.gratitude?.[1] ?? 'N/A',
        gratitude_3: parsed.gratitude?.[2] ?? 'N/A',
        journal: decodeEntities(parsed.journal ?? 'N/A'),
        tags: Array.isArray(parsed.tags) ? parsed.tags.join('|') : 'N/A',
        sleep_hours: parsed.sleep_hours ?? 'N/A',
        water_cups: parsed.water_cups ?? 'N/A',
        client_timestamp: parsed.client_timestamp ?? 'N/A',
      };
    });

    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const esc = (val: any) => {
      const s = String(val ?? '');
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => esc((r as any)[h])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    a.download = `wellness-entries-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // styles
  const card = 'bg-[var(--card)] dark:bg-neutral-900 rounded-2xl shadow-lg border border-[var(--border)]/40 dark:border-neutral-800 hover:shadow-[0_0_15px_var(--brand)] transition-shadow';
  const label = 'block mb-1 text-sm font-medium text-[var(--text)]/90 dark:text-neutral-200';
  const inputBase = 'w-full rounded-xl border border-[var(--border)]/50 dark:border-neutral-700 bg-[var(--bg)] dark:bg-neutral-950 text-[var(--text)] dark:text-neutral-100 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand)]';
  const buttonBase = 'px-4 py-2 rounded-xl font-medium shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed';
  const primaryBtn = `${buttonBase} bg-[var(--brand)] text-white hover:brightness-110`;
  const secondaryBtn = `${buttonBase} bg-[var(--bg)] dark:bg-neutral-950 text-[var(--text)] border border-[var(--border)]/60 hover:bg-[var(--card)]/60`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="inline-block px-3 py-1 rounded-lg bg-white/80 dark:bg-white/20 text-[var(--text)] dark:text-white font-extrabold text-2xl sm:text-3xl mb-4 animate-pulse">
        Wellness Entry 💌
      </h1>

      {toast && (
        <div className="mb-4 rounded-xl border border-emerald-400/40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-2">
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${card} p-4 sm:p-6 space-y-6`}>
        <div>
          <label className={label}>Energy: <span className="font-semibold">{energy}</span>/5</label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </div>

        <div>
          <label className={label}>3 things you’re grateful for</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className={inputBase} placeholder="Gratitude 1" value={grat1} onChange={(e)=>setGrat1(e.target.value)} />
            <input className={inputBase} placeholder="Gratitude 2" value={grat2} onChange={(e)=>setGrat2(e.target.value)} />
            <input className={inputBase} placeholder="Gratitude 3" value={grat3} onChange={(e)=>setGrat3(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={label}>Journal</label>
          <textarea
            className={`${inputBase} min-h-[160px]`}
            placeholder="Write about your wellness journey…"
            value={journal}
            onChange={(e)=>setJournal(e.target.value)}
            maxLength={4000}
            required
          />
          <div className="mt-1 text-xs text-[var(--text)]/60 dark:text-neutral-400">
            {journal.length}/4000
          </div>
        </div>

        <div>
          <label className={label}>Tags</label>
          <input
            className={inputBase}
            placeholder="comma or space separated (e.g. morning, gym, focus)"
            value={tagsText}
            onChange={(e)=>setTagsText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Sleep hours (optional)</label>
            <input
              className={inputBase}
              inputMode="decimal"
              placeholder="e.g. 7.5"
              value={sleepHours}
              onChange={(e)=>setSleepHours(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Water cups (optional)</label>
            <input
              className={inputBase}
              inputMode="numeric"
              placeholder="e.g. 6"
              value={waterCups}
              onChange={(e)=>setWaterCups(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button type="button" onClick={handleExportCSV} className={secondaryBtn}>
            Export to CSV
          </button>
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>

        <div className="text-xs text-[var(--text)]/60 dark:text-neutral-400">
          Auto date/time: {new Date(clientTimestampISO).toLocaleString()}
        </div>
      </form>

      
     <hr className="my-6 border-[var(--border)]/50 dark:border-neutral-700" />

      <div className="mt-6">
        <h3 className="inline-block px-2 py-1 rounded-md bg-white/80 dark:bg-white/20 text-[var(--text)] dark:text-white font-semibold text-lg mb-2">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-[var(--text)]/70 dark:text-neutral-300">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((row) => {
              let preview = '';
              try {
                const p = JSON.parse(row.entry);
                preview = p.journal || '';
              } catch {
                preview = row.entry;
              }
              return (
                <li key={row.id} className={`${card} p-3`}>
                  <div className="text-sm text-[var(--text)] dark:text-white line-clamp-3">
                    {decodeEntities(preview)}
                  </div>
                  <small className="text-[var(--text)]/60 dark:text-neutral-400">
                    {new Date(row.created_at).toLocaleString()}
                  </small>
                </li>
              );
            })}
          </ul>
        )}
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </div>
      <Link href="/dashboard" className="bg-[var(--accent)] hover:bg-[var(--accent)] fixed bottom-4 right-4 text-white py-2 px-4 rounded-lg">
        Back to Dashboard
      </Link>
    </div>
  );
}

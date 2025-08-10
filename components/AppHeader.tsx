import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function AppHeader() {
  const [profileUrl, setProfileUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_settings")
        .select("profile_url")
        .eq("user_id", user.id)
        .single();
      setProfileUrl(data?.profile_url ?? "");
    })();
  }, []);

  return (
    <header className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full border border-white/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/50 border border-white/20 grid place-items-center text-xs">
            🙂
          </div>
        )}
      </div>
    </header>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {useEffect, useRef} from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";


export default function App({ Component, pageProps }: AppProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect (() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.2;
      audio.play().catch(() => {
        console.log('Audio was blocked');
      });
    }
  }, []);

const router = useRouter();


return (
    <>
    <audio ref={audioRef} src="lofi.mp3" loop />
    <Component {...pageProps} />
    </>
);
}

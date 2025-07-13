import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {useEffect, useRef} from "react";
import {supabase} from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";


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

<Head>
  <link
  href="https://fonts.googleapis.com/css2?family=Bungee&family=Handlee&family=Libertinus+Mono&family=Tektur:wght@400..900&display=swap" rel="stylesheet"></link>
</Head>

return (
    <>
    <audio ref={audioRef} src="lofi.mp3" loop />
    <Component {...pageProps} />
    </>
);

}

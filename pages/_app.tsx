import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({Component, pageProps}: AppProps) {
  useEffect(() => {
    const storedTheme = localStorage.getItem("appTheme") || "light";
    document.documentElement.classList.add(storedTheme);
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}


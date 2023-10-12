"use client";
import { useEffect } from "react";
import { useLocalForage } from "./LocalForageHook";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export const useDarkMode:()=>[(string|undefined), ( value: string|undefined ) => void] = () => {
  const [theme,setTheme, removeTheme, isLoaded] = useLocalForage<string | undefined>('theme', undefined);
  useEffect(()=>{
    if(!isLoaded)
      return;
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isLoaded && theme]);
  useEffect(()=>{
    if(!isLoaded)
      return;
    if(theme ==undefined && window?.matchMedia('(prefers-color-scheme: dark)')?.matches){
      setTheme('dark');
    }
  }, [isLoaded, theme])
  return [theme??undefined,setTheme];
}

export const DarkModeHelper=()=>{
  useDarkMode();
  return <></>;
}

export const DarkModeSwitch=()=>{
  const [theme,setTheme] = useDarkMode();
  return <button onClick={ev=>setTheme(theme=="light"?"dark":"light")} type="button" className="interact"> {theme=="light"?<SunIcon className="w-8 h-8"/>:<MoonIcon className="w-8 h-8"/>}</button>
}
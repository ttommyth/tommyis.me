"use client";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react"

export function useStateWithGuard<T>(initState: T | (()=>T), equalCheck: (prev: T, next:T)=>boolean): [T, (value:SetStateAction<T>, guard?:boolean)=>void, RefObject<boolean>] {
  const guarding = useRef(false);
  const [value, setValue] = useState<T>(initState)
  return [
    value,
    (next:T | ((prevState: T) => T), guard?:boolean)=> {
      guarding.current = guard??false;
      setValue(prev => equalCheck(prev, typeof next==="function"?(next as any)(prev):next) ? prev : typeof next==="function"?(next as any)(prev):next)
    },
    guarding
  ]
}
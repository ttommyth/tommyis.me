"use client";

import { email, linkedinLink } from "@/data/contact";
import { PaperAirplaneIcon, PencilIcon } from "@heroicons/react/20/solid";
import { ChatBubbleLeftEllipsisIcon, DocumentDuplicateIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import GithubLogo from "public/icon/github.svg";
import LinkedinLogo from "public/icon/linkedin.svg";
import { FC, Fragment, PropsWithChildren, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {FaRegPaperPlane} from "react-icons/fa";
import * as yup from "yup";
import { TypeWriterSpan } from "../common/TypeWriterSpan";
import axios from "axios";
import { Loading } from "../common/Loading";
import { twMerge } from "tailwind-merge";
import Script from "next/script";

const stepArr = ["name", "email", "content", "submit", "submitted"];
const followUpMessage = ["Could you please provide me with your email address? This will help me get in touch with you.", "Could you please tell me a bit about the content you're interested in? Are you looking for specific projects or information related to my skills?", "Click the button below to send the message to me!"];

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().max(1024, "Max length reached").email("Email Invalid").required("Required"),
  content: yup.string().max(2048, "Max length reached").required("Required"),
})

const MessageLine:FC<PropsWithChildren<{from:"me"|"user"}>> = ({from, children})=>{
  return <div className="flex gap-4">
    <div className="w-8 h-8 px-4 bg-primary-500 data-[from='user']:bg-secondary-500 flex justify-center items-center text-base-100 font-black" data-from={from}>
      {from=="me"?"T":"U"}
    </div>
    <div className="grow leading-8">
      {children}
    </div>
  </div>
}


export const Contact = () => {
  const chatRef = useRef<HTMLDivElement|null>(null);
  const [step, setStep] = useState<keyof typeof validationSchema.fields | "submit"|"submitted">("name"); 
  const [loading,setLoading] =useState(false);
  const { handleSubmit,watch, register, getFieldState, trigger, formState} = useForm({ 
    defaultValues: {
      name:"",
      email:"",
      content:""
    },
    resolver: yupResolver(validationSchema), reValidateMode:"onChange", mode: "all"
  })
  const watchAllFields = watch()
  const onSubmit = async (data: {[key in keyof typeof validationSchema.fields]:string} ) => {
    setLoading(true);
    try{
      grecaptcha!.ready(async()=>{
        const token = await grecaptcha?.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {action: 'submit'});
        await axios.post("/api/contact", {...data, recaptcha:token});
        setStep("submitted");
      });
    }catch(err){
      if(err instanceof Error)
        alert(err.message);
    }finally{
      setLoading(false);
    }
  }
  return <>
    <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}`} />
    <div className="min-h-[100dvh] min-w-[320px] flex justify-center items-center px-0 pt-appbar sm:pt-4 sm:py-4 h-[100dvh] sm:h-auto ">
      <div className=" flex justify-stretch items-stretch w-full bg-base-300 dark:bg-base-900 border-default border-2  rounded-md flex-col sm:flex-row h-full sm:h-auto max-h-[100dvh] sm:max-h-[80dvh]">
        <div className="flex flex-row sm:flex-col h-auto sm:h-full [&>*]:p-2 [&>*]:rounded-md [&>*]:flex [&>*]:gap-4 [&>*]:items-center gap-2 p-2 text-sm pb-2 sm:pb-48 whitespace-nowrap">
          <span className="bg-base-200 dark:bg-base-800"><ChatBubbleLeftEllipsisIcon className="w-icon h-icon"/><span className="hidden sm:inline-block">Website</span></span>
          <Link href={"https://www.google.com/maps/place/%E9%A6%99%E6%B8%AF"} target="_blank"  className="dui-tooltip dui-tooltip-bottom sm:dui-tooltip-top" data-tip="Find me in"><MapPinIcon className="w-icon h-icon "/><span className="hidden sm:inline-block ">Hong Kong</span></Link>
          <button className="dui-tooltip dui-tooltip-bottom sm:dui-tooltip-top" data-tip="Click to copy" type="button" onClick={ev=>navigator.clipboard.writeText(email)}>          
            <EnvelopeIcon className="w-icon h-icon"/>
            <span className="hidden  sm:flex sm:items-center gap-2">
          Email           
              <Link href={`mailto:${email}?subject=Hi+Tommy`} className="inline-block" target="_blank">
                <FaRegPaperPlane className="w-5 h-5"/>
              </Link>
            </span>
          </button>
          <Link href={linkedinLink} className="" target="_blank"><LinkedinLogo className="w-icon h-icon "/><span className="hidden sm:inline-block">Linkedin</span></Link>
        </div>
        <div className="bg-default grow flex flex-col overflow-y-hidden relative">

          <div className="flex flex-col grow bg-dotted [&>div]:pl-4 [&>div]:p-8 [&>div:nth-child(odd)]:bg-base-300/50 [&>div:nth-child(odd)]:dark:bg-base-900/50 py-2 overflow-y-auto">
            <MessageLine from="me">
            Hello there! This is an contact me form, utilizing React Hook Form and Yup for seamless functionality, bolstered by reCAPTCHA v3 to ensure enhanced security. Please enter your name in the input box below! 🧑🏻‍💻
            </MessageLine>

            {
              (["name", "email", "content"] as const).map((it,idx)=>
                <Fragment key={idx}>
                  { 
                    stepArr.indexOf(step) > stepArr.indexOf(it) ?
                      <>
                        <MessageLine from="user">
                          {watchAllFields[it]} {step=="submitted"?<></>: <button onClick={ev=>setStep(it)} className="ml-2 interact"><PencilIcon className="w-4 h-4"/></button>}
                        </MessageLine>
                        {followUpMessage[stepArr.indexOf(it)]?
                          <MessageLine from="me">
                            <TypeWriterSpan showCursor={stepArr.indexOf(step)==idx+1} onEvent={(ref, ev)=>ref.scrollIntoView()}>
                              {followUpMessage[stepArr.indexOf(it)]}
                            </TypeWriterSpan>
                          </MessageLine>:<>
                          </>}
                      </>:<>
                      </>
                  }
                </Fragment>
            
              )
            }
            {
              step=="submitted"?<MessageLine from="me">
    Thanks for your message!
              </MessageLine>:<></>
            }
          </div>
          <form className="m-2  mb-8 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <span className="relative group">
              {
                step=="submitted"?<>
                </>:
                  step=="submit"?
                    <button type="submit" className="flex items-center gap-4 px-4 py-2 border-default-invert border-2 bg-base-200 dark:bg-base-900 mx-auto rounded-xl">
              Send <PaperAirplaneIcon className="w-4 h-4"/>
                    </button>:<>
                      {
                        (["name", "email", "content"] as const).map((it,idx)=>{
                          if(it=="content")
                            return <textarea className="pr-10 w-full" {...register(it, {required:true})} key={idx} style={{display:step==it?"block":"none"}}  placeholder={it} />
                          return <input type="text" className="pr-10 w-full" {...register(it, {required:true})} key={idx} style={{display:step==it?"block":"none"}} placeholder={it} />
                        }
                        )
                      }
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 disabled:text-base-500 " type="button" onClick={ev=>setStep(v=>v=="name"?"email":v=="email"?"content":"submit")}
                        disabled={!!formState.errors[step] || !formState.dirtyFields[step]}>
                        <div className="group-interact" >
                          <PaperAirplaneIcon className=" w-icon h-icon "/>
                        </div>
                      </button>
                      <span className="text-sm absolute top-full pt-1 left-2 text-red-500">{formState.errors[step]?.message}</span>
                    </>
              }
            </span>
          </form>
          <div className={twMerge("absolute absolute-fill", loading?"":"hidden")}>
            <Loading />
          </div>
        </div>
      
      </div>
     
    </div> 
  </>
}
export default Contact;
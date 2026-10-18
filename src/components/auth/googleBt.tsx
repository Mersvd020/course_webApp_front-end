'use client'

//asssets
import GoogleIco from "@/assets/ico/auth/google-ico.png"

import Image from "next/image"

interface titleProps {
    title: "ثبت نام در رویش با گوگل" | "ورود به حساب کاربری با گوگل"
}

export default function SubmitBt ({title}:titleProps) {

    return (
    <button type="submit" className=" flex flex-row gap-1 justify-center py-3 w-full border border-[gray]/40 rounded-[16px] 
     font-medium   ">
    <Image alt="google" src={GoogleIco} /> {title}
    </button>
    )
}
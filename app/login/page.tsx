'use client'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"

export default function Login({params}){
    const r = useRouter()
    useEffect(() => {r.push('login/login')},[])
    return <>Login...</>
}
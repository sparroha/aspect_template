'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';

export default function Main({params}) {
    //ROOT INACCESSIBLE: REDIRECT IMENENT
    const router = useRouter();
    useEffect(() => { router.push('/home/'+(params.aspect?params.aspect+'/':'')+(params.name || 'guest')) },[]);
    return <div>Home Loading...</div>
}


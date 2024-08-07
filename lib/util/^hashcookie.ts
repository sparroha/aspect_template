'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

export function useHashCookie(): [string, Dispatch<SetStateAction<string>>]{
    const [hash, setHash] = useState(null)
    /**
     * IF VALID COOKIE THEN SET HASH
     */
    useEffect(()=>{
        if(!document.cookie) return //console.log('@^HashCookie: no cookie ', document.cookie)
        if(hash) return //console.log('@^HashCookie: already have hash ', hash)
        let cook = document.cookie
        //console.log('@^HashCookie: raw cookie (cook):', cook)
        let cooking = cook.split(';')
        //console.log('@^HashCookie: split cookie (cooking):', cooking)
        let cooked = cooking.map((c)=>c.trim().split('='))
        //console.log('@^HashCookie: trimmed cookie (cooked):', cooked)
        let [,secret] = cooked.find((c, i)=>c[0]=='secret')
        setHash(secret)
        //console.log('@^HashCookie: got cookie (secret):', secret)
    },[])
    /**
     * IF VALID HASH THEN SET COOKIE
     */
    useEffect(()=>{
        if(!hash) return //console.log('@^HashCookie: no hash ', hash)
        document.cookie = `secret=${hash}; max-age=604800; path=/`
        //console.log('@^HashCookie: sending hash to local save ', hash)
    },[hash])

    return [hash, setHash]
}
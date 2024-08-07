import { useEffect } from 'react'

export default async function useLoop(callback: ()=>void, ms: number, deps: any[]){
    'use client'
    useEffect(()=>{
        const i = setInterval(callback, ms)
        //console.log('async loop')
        return ()=>{
            //console.log('async loop dismount')
            clearInterval(i)
        }
    }, deps)
}

/*const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
export async function loop(callback: ()=>void, ms: number) {
    await delay(ms)
    console.log('loop')
    callback()
    loop(callback, ms)
}*/
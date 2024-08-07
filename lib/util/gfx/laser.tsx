'use client'
import { useEffect, useState } from "react"

export default function Laser({angle, color, width, radiance, hexopacity, rotation}: {angle: number, color: string, width: number, radiance: number, hexopacity?: string, rotation?: number}){
    const [rotationAngle, setRotationAngle] = useState(0)
    const R = 40

    useEffect(()=>{
        const interval = setInterval(()=>{
            let time = Date.now()/1000
            if(rotation) return setRotationAngle(time*rotation)
        }, 1000/60)
        return ()=>clearInterval(interval)
    }, [])
    return <div style={{position: 'absolute', width: R+'%', height: R+'%', top: (100-R)/2+'%', left: (100-R)/2+'%', rotate: rotationAngle+'deg', backgroundImage: neonLaser(rotation?0:angle, color, width, radiance, hexopacity)}}></div>
}
export function neonLaser(angle: number, color: string, width: number, radiance: number, hexopacity?: string){
    return `linear-gradient(${angle}deg, #000000${hexopacity || '00'}, #000000${hexopacity || '00'} ${50-width-radiance}%, ${color} ${50-width}%, #fff 50%, ${color} ${50+width}%, #000000${hexopacity || '00'} ${50+width+radiance}%, #000000${hexopacity || '00'} 100%)`
}
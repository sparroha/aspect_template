import { useEffect } from "react";

export function useAutoSave(save: ()=>void, loading: boolean, dependancies?: any[]){
    useEffect(()=>{if(loading) return;save()},[...(dependancies || [])])
}
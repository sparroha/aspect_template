import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

/**
 * 
 * @param registry 
 * @param defaultValue 
 * @returns data: string, setter: Function, loaded: boolean
 */
export default function useRegister(registry: string, defaultValue: any):[string, Function, boolean]{
    
    //useLog('@useRegister://REGISTRY_NAME: '+registry+' :: REGISTRY: '+JSON.stringify(reg))
    const [currentsave, setCurentSave] = useState(registry)//current save
    const [registryLoaded, setRegistryLoaded] = useState(false)
    const [register, setRegister] = useState(JSON.stringify(defaultValue))//register setter and render function
    const {data, error} = useSWR('../api/registry/'+registry, { refreshInterval: 500 })//get data from database
    //useLog('@useRegister://REGISTER: '+JSON.stringify(register.current)+' :: LOADED: '+registryLoaded)
    useEffect(()=>{//load data from database
        if(!data) return
        if(data == null || data == undefined) return
        setRegister(JSON.stringify(data))
    },[data])
    //INIT
    //initialize register from database
    async function loadDataOnce(registry, register){
        if(registryLoaded) return
        if(!registry) {console.log('registry: '+registry); return}
        if(registry ==  null) {console.log('registry: '+registry); return}
        //if(register)return//overguard
        return getDB(registry).then(data=>{
            if(!data) return
            if(data == null ) return
            if(data == undefined) return
            if(data == 0) {
                //console.log('@useRegister.loadDataOnce://fetch initializing new register: '+registry+': '+register)
                setDB(registry, defaultValue)
                return
            }
            //console.log('@useRegister.loadDataOnce://fetch data to replace default register: '+register)
            //console.log('@useRegister.loadDataOnce://fetch with data for '+registry+': '+JSON.stringify(data))
            setRegistryLoaded(true)
        }).catch(err=>console.log('@useRegister.loadDataOnce://fetch error: '+err))
    }

    //load saved data once and if data name changes
    useEffect(()=>{
        if(!registry)return
        if(registry != currentsave){
            setRegistryLoaded(false)
            setCurentSave(registry)
        }
        loadDataOnce(registry, register)
    },[registry])//load registry
    //END INIT

    const saveData = useCallback((data) => {//save data to database{//works and tested
        setRegister(JSON.stringify(data))
        //console.log('@useRegister.saveRegister://set register '+JSON.stringify(registry)+': '+JSON.stringify(data))
        setDB(registry, data)
    },[registry])
    return [register, saveData, registryLoaded]
}

//updates database with current register ref
export async function setDB(name: string, data: any){
    //console.log('@setDB://set '+name+' to '+JSON.stringify(data))
    await fetch(`/api/registry/${name}`, {
        method: 'POST',
        body: JSON.stringify({
            registry_data: data
        })
    }).then(res => {
        //console.log('@setDB://res: '+JSON.stringify(res))//always {}
        return res.json()
    })
}

export async function getDB(name: string){
    return fetch(`/api/registry/${name}`)
    .then(res=>{
        //console.log('@getDB://fetch res: '+JSON.stringify(res))//always {}
        return res.json()
    })
}

'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import jsonFetch from "../,base/jsonFetch";
import { RegistryFetch } from "../../app/api/registry/route";
import { getDB, setDB } from "./@registry";

/**
 * Implementation
 *
const [data, saveData, dataInitialized] = useRegister('uuid:name', "default")
const [customData, setCustomData] = useState(null)
function load(data: any){
    setCustomData('data: any')
}
useEffect(()=>{
    if(!data) return
    let parsed: any = data
    try {
        parsed = JSON.parse(data)
    } catch (error) {
        return console.log(error)
    }
    load(parsed)
},[data])
function save(customData){
    saveData(customData)
}
 *
/*********************************************\
 * const logos: string[]
 * const [customData, save]: [Custom, (Custom)=>void] = convolutedSetState()
\*********************************************/

/**
 * 
 * @param registry 
 * @param defaultValue 
 * @returns data: string, setter: Function, loaded: boolean
 */
export default function useRegister(registry: string, defaultValue: any, sync?: boolean/**sync EXPERIMENTAL**/):[string | null, Function, boolean]{
    
    const [currentsave, setCurentSave] = useState(registry)//current save
    const [registryExists, setRegistryExists] = useState(false)
    const [register, setRegister]: [string | null, any] = useState(null)//This nust be null by default: Do not set to default value: that is for initialization only
    const {data, error} = useSWR('../api/registry/'+registry, sync?{ refreshInterval: 500, fetcher: jsonFetch}:{})//get data from database
    
    //INIT
    async function loadDataOnce(registry,  signal?: AbortSignal){
        if(registryExists) return
        if(!registry) {console.log('@useRegister://REGISTER: '+'no registry: '+registry); return}
        if(registry ==  null) {console.log('@useRegister://REGISTER: '+'null registry: '+registry); return}
        return getDB(registry, signal).then(({data}: {data: string})=>{
            if(data == null || data == undefined || !data || data == "default") {
                //init registry: only sets default if data not exist
                setRegistryExists(false)
                return setDB(registry, defaultValue)
            }
            setRegistryExists(true)
            setRegister(data)
        }).catch(err=>console.log('@useRegister.loadDataOnce://fetch error: '+err))
    }

    useEffect(()=>{
        if(!registry)return
        if(registry != currentsave){
            setRegistryExists(false)//start as false
            setCurentSave(registry)
        }
        loadDataOnce(registry)//returns setRegistryExists(true)
    },[registry])

    const saveData = useCallback((dat) => {//save data to database{//works and tested
        setRegister(JSON.stringify(dat))
        setDB(registry, dat).then(()=>{
            /*EXPERIMENTAL*///if(sync)getDB(registry).then((d: string)=>setRegister(d))
        })
    },[registry])
    return [sync?data:register, saveData, registryExists]
}

/**
 * extention of useRegister
 * takes a optional loader for advanced parsing and data initialization
 * returns parsed data and registry save function
 * @param uuid 
 * @param defaultValue 
 * @param loader 
 * @returns 
 */
export function useCustomRegistry(uuid: string = 'uuid:name', defaultValue: any = "default", sync?: boolean, loader?: (data: any)=> any, saver?: (data: any)=> any):[any,(data: any)=>(data: any | ((data:any)=>any))=>any]{
    const [data, _saveData, dataInitialized] = useRegister(uuid, defaultValue, sync)
    const [_customData, setCustomData] = useState(null)
    //Load from DB
    useEffect(()=>{
        if(!data) return
        let parsed: any = data
        try {
            parsed = JSON.parse(data)
        } catch (error) {
            return console.log(error)
        }
        
        setCustomData(loader?loader(parsed):parsed)
    },[data])
    return [dataInitialized?_customData:'NoData', (data: any)=>_saveData(saver?saver(data):data)]
}
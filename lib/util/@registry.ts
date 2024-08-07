import { RegistryFetch } from "../../app/api/registry/route"

export class Registry_experimental{
    uuid: string
    defaultValue: any
    registryLoaded: boolean
    postData: string
    getData: string
    parsedData: any
    constructor(uuid: string, defaultValue: any){
        this.uuid = uuid
        this.defaultValue = defaultValue
        this.registryLoaded = false
        this.postData = JSON.stringify(defaultValue) || null
        this.getData = null
        this.parsedData = null
        try{
            this.parsedData = JSON.parse(this.getData)
        }catch(err){
            this.parsedData = this.getData
        }
    }

    put = async (data, uuid?: string)=>{
        setDB(uuid || this.uuid, data)
    }
    get = async (uuid?: string)=>{
        this.getData = (await getDB(uuid || this.uuid)).data
        return this.getData
    }

}


//updates database with current register ref
//updates database with current register ref
export async function setDB(name: string, data: any){
    //console.log('@setDB://set '+name+' to '+JSON.stringify(data))
    //let post: Promise<RegistryFetch> = 
    await fetch(`/api/registry`, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            data: data
        })
    }).then(res => {if(!res)console.error('setDB error',res.json())})
    //console.log('@setDB://set '+name+' to '+JSON.stringify(data)+'\n'+JSON.stringify(post))
}

export async function getDB(name: string, signal?: AbortSignal): Promise<RegistryFetch>{
    return fetch(`/api/registry/${name}?create=true`,{signal: signal}).then(res=>res.json())
}

export async function searchDB(name: string, signal?: AbortSignal): Promise<{name: string, registry_data: string}[]>{
    return fetch(`/api/registry/${name}?command=search`,{signal: signal}).then(res=>res.json())
}
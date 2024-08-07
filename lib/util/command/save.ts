import { useState } from "react";
import Command from "./command";

class Save extends Command {
    data: any
    uid: string
    isLoading: boolean
    constructor(uid: string) {
        super({name: "save", description: "Save the current project", usage: "Save.post('uniqueid',data); Save.get('uniqueid');", category: "registry"});
        this.uid = uid
        this.isLoading = true
        this.data = null
    }
    async post(data: any, id?: string){
        this.uid = id || this.uid
        this.isLoading = true
        //console.log('@setDB://set '+name+' to '+JSON.stringify(data))
        await fetch(`/api/registry/${this.uid}`, {
            method: 'POST',
            body: JSON.stringify({
                registry_data: data
            })
        }).then(res => res.json())
        .then(data => {
            console.log('Success:', data);
            console.log('this.post()');
            this.get()
        }).catch(error => {
            console.log('error in Save.post():'+JSON.stringify(error));
            this.isLoading = false
        })
    }
    
    async get(id?: string){
        this.uid = id || this.uid
        this.isLoading = true
        await fetch(`/api/registry/${this.uid}`)
        .then(res=>res.json())
        .then(data => {
            console.log('Success:', data);
            console.log('this.get()');
            this.data = data || "No Data"
            this.isLoading = false
            console.log('this.data:', this.data);
        }).catch(error => {
            console.log('error in Save.get():'+JSON.stringify(error));
            this.isLoading = false
        })
    }
}
export default Save
/*export function useSave(uid: string){
    const [save, setSave] = useState(new Save(uid))

    save.get(setSave)
    return save
}*/
import { useReducer } from "react";

export type Pld = { [key: string]: any }
export type Act = { type: string, payload: Pld }
export type Dsp = (action: Act)=>any
export type Rdc = (state: any, action: Act)=>[any, Dsp]

export const initial = {count: 0}
export default function useR(initialState?: any, reducerSub?: Rdc){
    const red: Rdc = reducerSub || reducer;
    const init: any = initialState || initial;
    const [state, dispatch] = useReducer(red ,init)
    return [state, dispatch]
}
export function reducer(state: any, action: Act): any{
    switch(action.type){
        case 'increment':
            return {count: state.count + 1}
        case 'decrement':
            return {count: state.count - 1}
        default:
            throw new Error();
    }
}

export async function getDB(name: string){
    return fetch(`/api/reducer/${name}`)
    .then(res=>{
        console.log('@getDB://fetch res: '+JSON.stringify(res))
        return res.json()
    })
}
export async function setDB(name: string, data: any){
    await fetch(`/api/reducer/${name}`, {
        method: 'POST',
        body: JSON.stringify({
            reducer_data: data
        })
    }).then(res => console.log(res.json()))
}
export async function updateDB(name: string, data: any){
    await fetch(`/api/reducer/${name}`, {
        method: 'PUT',
        body: JSON.stringify({
            reducer_data: data
        })
    }).then(res => console.log(res.json()))
}

// create reducer that auto updates the database for each command
// reducer action may look like action = {type: 'increment', payload: {count: 1}}
// the sql query will be something like UPDATE table SET count = count + 1 WHERE id = 1
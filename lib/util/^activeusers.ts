'use client'
import { useEffect, useState } from "react"
import { getDB, setDB } from "./@registry"
import { ActiveUser } from "../../app/api/users/active/route"
import { User } from "../../app/login/[action]/page"
/*export type ActiveUser = {
    name: string,
    access: number,
    time: number,
  }*/
export const ACTIVEUSERS = 'active_users'
export default function useActiveUsers(delay: number = 2000): ActiveUser[]{
    const [activeUsers, setActiveUsers] = useState([{name: 'Loading...', access: 2, time: Date.now()}])
    useEffect(()=>{
        const f = setInterval(()=>{
            fetch('/api/users/active',{ next: { revalidate: 0 } }).then((res)=>res.json()).then((data: {data: ActiveUser[]})=>setActiveUsers(data.data))
        }, delay)
        return ()=>clearInterval(f)
    },[])
    return activeUsers
}
export async function activateUser(user: Partial<User>){
    //console.log('activating')
    if(!user) return console.log('/lib/util/^activeusers.activateUser(): No user provided')
    return getDB(ACTIVEUSERS)
      .then((data: {data: string})=>JSON.parse(data.data) || [])
      .then((data: ActiveUser[])=>{
        if(data.length == 0){
          setDB(ACTIVEUSERS, [{name: user.username, access: user.access || 0, time: new Date().getTime()}])
        }else{
          //remove current and old users
          let dataArr = data.filter(({time, name}) => {
            if(name == user.username) return false //prevent duplicate user entry
            if((new Date().getTime() - time) > (1000*60*60)/6) return false//remove users that havent been active in the last hour...last 10 min
            return true
          })
          //console.log('activated')
          dataArr.push({name: user.username, access: user.access, time: new Date().getTime()})
          setDB(ACTIVEUSERS, dataArr)
        }
      }
    )
  }
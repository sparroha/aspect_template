'use client'
import useActiveUsers from "./^activeusers"

export default function ActiveUsers(props){
    const {style} = props
    const activeUsers = useActiveUsers(10000)
    return <div style={style}>{activeUsers?.map((user, i)=>{
        let now = Date.now()
        let then = new Date(user.time).getTime()
        if(now-then>600000) return null
        //console.log('now', now, 'then', then)
        let seconds = Math.floor((now-then)/1000)
        let minutes = Math.floor(seconds/60)
        let minutseconds = (minutes<10?'0':'')+minutes+':'+(seconds%60<10?'0':'')+seconds%60
        return <div key={i} style={{color: (user.access<1?'#080':user.access<2?'#008':'#800')}}>
            {user.name}{' (active '}{minutseconds}{' ago)'}
        </div>
    })}</div>
}
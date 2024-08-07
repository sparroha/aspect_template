'use client'
import useUser from "./^user"
export default function UserLogin(props){
    const {homepage, style, button, debug} = props
    const user = useUser()
    function handleLogout(e){
        e.preventDefault()
        document.cookie = 'secret=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        console.log('COOKIE at logout', document.cookie)
        setTimeout(()=>{window.location.reload()}, 100)
    }
    if(!user) return <a className={props.className} style={style} 
        href={'/login/login?homepage=' + (homepage || 'home')}
    >{button?<button>Login</button>:'Login'}</a>
    return <a className={props.className} style={style} 
        href={'/login/logout?homepage=' + (homepage || 'home')}
        onClick={handleLogout}
    >
        {button?<button>Logout</button>:'Logout '+user.username}
    </a>
}
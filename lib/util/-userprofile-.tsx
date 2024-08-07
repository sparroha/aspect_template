'use client'
import useUser from "./^user"
export default function UserProfile(props){
  const user = useUser()
  const debug = props.debug
  if (!user?.username) return <></>//<div style={props.style}>loading...</div>

  let greeting = 'Welcome back '+user?.username+'{'+(user?.message || '')+'}!'
  return <div style={{...props.style,
    color: 'white',
    background: 'none repeat scroll 0 0 #000000',
    borderRadius: '20px',
    padding: 12,
    textAlign: 'center',
    border: '2px outset #bbb',
    backgroundImage: 'linear-gradient(to bottom right, #777, #aaa, #ddd, #fff)'
  }}>
    {greeting}!{` \<${user?.email}\> `} Your access level is {user?.access}.
  </div>
}
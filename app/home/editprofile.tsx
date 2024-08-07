import { sha224 } from "js-sha256"
import { useState } from "react"
import { Col, Row } from "react-bootstrap"
import { User } from "../login/[action]/page"

const buttonStyle = {
    backgroundColor: '#777',
    color: '#fff',
    border: '2px solid #888',
    borderRadius: '5px',
    padding: '0px 5px 0px 5px',
    margin: '5px',
}
const textFieldStyle = {
    overflow: 'hidden',
    backgroundColor: '#eee',
    color: '#000',
    border: '2px solid #888',
    borderRadius: '5px',
    padding: '0px 5px 0px 5px',
    margin: '0px 5px 0px 5px',
    width: '80%'
}
export default function EditProfile({user}: {user: Partial<User>}){
    return <Row xs={1} sm={1} md={2}>
        <Col><EditUsername user={user} /></Col>
        <Col><EditPassword user={user} /></Col>
        <Col><EditEmail user={user} /></Col>
    </Row>
}
function EditUsername({user}: {user: Partial<User>}){
    const [username, setUsername] = useState(user?.username)
    const updateUsername = async ()=>{
        await fetch('/api/user/'+user?.hash, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user?.id,
                username: username,
                collumn: 'username',
                command: 'update'
            })
        }).then(res => {console.log(res); res.json()}).then(data => console.log(data))
    }
    return <form>
        <label>Current Username:</label><br/>
        <label style={textFieldStyle}>{user?.username}</label><br/>
        <label>New Username:</label><br/>
        <input style={textFieldStyle} type='text' onChange={(e)=>setUsername(e.target.value)} value={username} /><br/>
        <button style={buttonStyle} onClick={updateUsername}>save Username</button>
    </form>
}function EditEmail({user}: {user: Partial<User>}){
    const [pass, setPass] = useState('')
    const [newMail, setNewMail] = useState(user?.email)
    const [showPass, setShowPass] = useState(false)
    const [showPassTip, setShowPassTip] = useState(false)
    const [newHash, setNewHash] = useState(user?.hash)
    const sethashpass = (e)=>{
        let p = e.target.value
        let h = sha224(newMail?.toString().toLocaleLowerCase()+''+p)
        setPass(p)
        setNewHash(h)
        console.log(h)
        console.log(newHash)
    }
    const sethashmail = (e)=>{
        let m = e.target.value
        let h = sha224(m.toString().toLocaleLowerCase()+''+pass)
        setNewMail(m.toLowerCase())
        setNewHash(h)
        console.log(h)
        console.log(newHash)
    }
    const updateHashMail = async ()=>{
        let passwordcomparehash = sha224(user?.email?.toString().toLocaleLowerCase()+''+pass)
        let passwordcorrect = passwordcomparehash == user?.hash
        if(!passwordcorrect){
            alert('incorrect password')
            return
        }
        console.log('pushing newHash to user '+user?.username+': hash = '+newHash)

        await fetch('/api/user/'+user?.hash, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user?.id,
                newHash: newHash,
                email: newMail,
                collumn: 'email',
                command: 'update'
            })
        }).then(res => {console.log(res); res.json()}).then(data => console.log(JSON.stringify(data)))
    }
    return <form>
        <label>Current Password:</label>
        <input type='checkbox' onMouseOver={()=>setShowPassTip(true)} onMouseOut={()=>setShowPassTip(false)} onChange={(e)=>setShowPass(e.target.checked)} checked={showPass} />
        <label hidden={!showPassTip}>Show Password</label>
        <br/>
        <input style={textFieldStyle} type={!showPass?'password':'text'} onChange={sethashpass} value={pass} autoComplete={"on"}/>
        <br/>
        <label>Current Email:</label><br/>
        <label style={textFieldStyle}>{user?.email}</label>
        <br/>
        <label>New Email:</label><br/>
        <input style={textFieldStyle} type={'text'} onChange={sethashmail} value={newMail} />
        <br/>
        <button style={buttonStyle} onClick={updateHashMail}>save Email</button>
    </form>
}
function EditPassword({user}: {user: Partial<User>}){
    const [password, setPassword] = useState('')
    const [newPass, setNewPass] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [showPassTip, setShowPassTip] = useState(false)
    const [newHash, setNewHash] = useState(user?.hash)
    const sethashpass = (e)=>{
        let p = e.target.value
        let h = sha224(user?.email?.toString().toLocaleLowerCase()+''+p)
        setNewPass(p)
        setNewHash(h)
        console.log(h)
        console.log(newHash)
    }
    const updateHash = async ()=>{
        let passwordcomparehash = sha224(user?.email?.toString().toLocaleLowerCase()+''+password)
        let passwordcorrect = passwordcomparehash == user?.hash
        if(!passwordcorrect){
            alert('incorrect password')
            return
        }
        console.log('pushing newHash to user '+user?.username+': hash = '+newHash)
        
        await fetch('/api/user/'+user?.hash, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user?.id,
                newHash: newHash,
                collumn: 'password',
                command: 'update'
            })
        }).then(res => {console.log(res); res.json()}).then(data => console.log(JSON.stringify(data)))
    }
    return <form>
        <label>Current Password:</label>
        <input type='checkbox' onMouseOver={()=>setShowPassTip(true)} onMouseOut={()=>setShowPassTip(false)} onChange={(e)=>setShowPass(e.target.checked)} checked={showPass} />
        <label hidden={!showPassTip}>Show Password</label>
        <br/>
        <input style={textFieldStyle} type={!showPass?'password':'text'} onChange={(e)=>setPassword(e.target.value)} value={password} autoComplete={"on"}/>
        <br/>
        <label>New Password:</label>
        <input type='checkbox' onMouseOver={()=>setShowPassTip(true)} onMouseOut={()=>setShowPassTip(false)} onChange={(e)=>setShowPass(e.target.checked)} checked={showPass} />
        <label hidden={!showPassTip}>Show Password</label>
        <br/>
        <input style={textFieldStyle} type={!showPass?'password':'text'} onChange={sethashpass} value={newPass} autoComplete={"off"}/>
        <br/>
        <button style={buttonStyle} onClick={updateHash}>save Password</button>
    </form>
}
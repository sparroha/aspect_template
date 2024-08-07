
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import useSWR from "swr"
import jsonFetch from "../../lib/,base/jsonFetch"
import useWindowSize from "../../lib/util/^windowsize"
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
    backgroundColor: '#eee',
    color: '#000',
    border: '2px solid #888',
    borderRadius: '5px',
    padding: '0px 5px 0px 5px',
    margin: '5px',
    width: '100%'
}
const tdStyle = {
    backgroundColor: '#eee',
    color: '#000',
    border: '2px solid #888',
    borderRadius: '5px',
    padding: '0px 5px 0px 5px',
    margin: '5px',
}
export default function EditUsers(props){
    const windowWidth = useWindowSize()[0]
    const [selectUser, setSelectUser] = useState<Partial<User>>({})
    const {data, error} = useSWR('/api/getuserdetails?command=getall', {refreshInterval: 200, fetcher: jsonFetch})
    if(!data) return <>Loading Users...</>
    return <Row><Col sm={12}>
        <table>
            <thead><tr>
                <td style={tdStyle}><label>id</label></td>
                <td style={tdStyle}><label>username</label></td>
                {(windowWidth=='xs' || windowWidth=='sm')?null:<td style={tdStyle}><label>email</label></td>}
                <td style={tdStyle}><label>access</label></td>
                <td style={tdStyle}><label>select</label></td>
            </tr></thead>
            <tbody>
            {data.map((user, i)=>{
                return <tr key={i}>
                    <td style={tdStyle}><label>{user.id}</label></td>
                    <td style={tdStyle}><label>{user.username}</label></td>
                    {(windowWidth=='xs' || windowWidth=='sm')?null:<td style={tdStyle}><label>{user.email}</label></td>}
                    <td style={tdStyle}><label>{user.access}</label></td>
                    <td style={tdStyle}>
                        <input type={'checkbox'} checked={selectUser.id == user.id} onChange={(e)=>setSelectUser(user)}/>
                    </td>
                </tr>
            })}
            </tbody>
        </table>
        {selectUser?<EditAccess user={selectUser} />:<></>}

    </Col></Row>
}
function EditAccess({user}: {user: Partial<User>}){
    const [newAccess, setNewAccess] = useState(user.access)
    useEffect(()=>{setNewAccess(user.access)}, [user])
    const updateAccess = async (acs)=>{
        await fetch('/api/user/'+user.hash, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.id,
                newAccess: acs,
                collumn: 'access',
                command: 'update'
            })
        }).then(res => res.json()).then(data => console.log(JSON.stringify(data)))
    }
    return <div>
        <label>{'Set acccess rank for '+user.username+' to: '}</label>
        <select value={newAccess==0?'user':newAccess==1?'mod':'admin'}
            onChange={(e)=>{
                setNewAccess((a)=> {
                    let aNew = 0
                    switch(e.target.value){
                        case 'mod':
                            aNew = 1
                            break
                        case 'admin':
                            aNew = 2
                            break
                        default:
                            break
                    }
                    updateAccess(aNew)
                    return aNew
                })
            }}>
            <option value={'user'}>user</option>
            <option value={'mod'}>mod</option>
            <option value={'admin'}>admin</option>
        </select>
    </div>
}

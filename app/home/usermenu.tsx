import { useMemo, useState } from "react"
import { Col, Nav, Row } from "react-bootstrap"
import EditProfile from "./editprofile"
import EditUsers from "./editusers"
import { User } from "../login/[action]/page"

export default function UserMenu({user, homepage}: {user: Partial<User>, homepage: string}){
    if(!user) return <></>
    const userSettings = useMemo(() => {return {
        user: user
    }},[user])
    return <Row>
        <Col xs={12}><UserStats user={user}/></Col>
        <Col xs={12}><UserSettings user={user} /></Col>
    </Row>
}
function UserStats({user}: {user: Partial<User>}){
    return <Row xs={1} sm={2} md={2} lg={3} xl={3} >
        {Object.entries(user).map(
            (value, index) => {
                let [tag, val] = value
                if(tag==='hash') val = '********'
                return <Col xs={12} sm={6} md={3} key={index}>
                    <div style={{backgroundColor: '#ddd', margin: '1px', paddingLeft: '5px'}}>
                    <b>{tag}</b>{': '}{val}
                </div></Col>
            }
        )}
    </Row>
}
function UserSettings({user}: {user: Partial<User>}){
    const {access} = user
    const [showUserSettings, setShowUserSettings] = useState(false)
    const [modShowUsers, setModShowUsers] = useState(false)
    const [adminShowUsers, setAdminShowUsers] = useState(false)
    if(!user) return null
    function GeneralSettings(){
        return <Row style={{borderTop: '2px solid black'}}>
            <Col sm={12}>
                <Row>User Settings<hr/></Row>
                <Row>
                    <Col sm={1}>
                        <input style={{backgroundColor: '#777'}} type='checkbox' onChange={e=>setShowUserSettings(e.target.checked)} checked={showUserSettings} />
                    </Col>
                    <Col sm={11}>
                        <h4>Edit Profile</h4><br/>{showUserSettings?<EditProfile user={user}/>:null} 
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    function ModeratorSettings(){
        if(access && access<1) return null
        return <Row style={{borderTop: '2px solid black'}}>
            <Col sm={12}>
                <Row>Moderator Settings</Row>
                <Row>
                    <Col sm={3}>
                        <input style={{backgroundColor: '#777'}} type='checkbox' onChange={e=>setModShowUsers(e.target.checked)} checked={modShowUsers} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        {modShowUsers?<>TODO: user moderation</>:null} 
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    function AdminSettings(){
        if(access && access<2) return null
        return <Row style={{borderTop: '2px solid black'}}>
            <Col sm={12}>
                <Row>Admin Settings</Row>
                <Row>
                    <Col sm={1}>
                        <input style={{backgroundColor: '#777'}} type='checkbox' onChange={e=>setAdminShowUsers(e.target.checked)} checked={adminShowUsers} />
                    </Col>
                    <Col sm={11}>
                        <h4>Edit Permissions</h4><br/>{adminShowUsers?<EditUsers/>:null}
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    return <>
        <GeneralSettings/>
        <ModeratorSettings/>
        <AdminSettings/>
    </>
}
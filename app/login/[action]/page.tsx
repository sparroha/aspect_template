'use client'
import { sha224 } from "js-sha256"
import { useRouter } from "next/navigation"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import UserProfile from "../../../lib/util/-userprofile-"
import { useHashCookie } from "../../../lib/util/^hashcookie"
import { useEffect, useState, FC } from "react"
import useUser from "../../../lib/util/^user"
import ColorPicker, { useColors } from "../../../lib/util/-colorpicker^colors-"

export type StoredUser = {
  id: number,
  username: string,
  email: string,
  hash: string,
  access: number,
  ip: string
}
export type User = StoredUser & {
  message: string,
  homepage: string,
}

export default function LoginApp({params, searchParams}) {
    const {root, userLogin} = params
    const username = searchParams.username?.toString().toLocaleLowerCase() || ''
    const email = searchParams.email?.toString().toLocaleLowerCase() || ''
    const nemail = searchParams.nemail?.toString().toLocaleLowerCase() || ''
    const cemail = searchParams.cemail?.toString().toLocaleLowerCase() || ''
    const password = searchParams.password?.toString().toLocaleLowerCase() || ''
    const homepage = searchParams.homepage && searchParams.homepage!='undefined' ? searchParams.homepage : (root || 'home')

    const router = useRouter()
    const user = useUser()
    const [hash, setHash] = useHashCookie()
    const [action, setAction] = useState(userLogin || searchParams.userLogin || 'login')
    
    const [colors1, setColors1] = useColors(3)
    const [colors2, setColors2] = useColors(3)
    const loginLayout = {
        backgroundImage: `linear-gradient(to bottom right, ${colors1?.[0] || '#7777ff'}, ${colors1?.[1] || '#77ff77'}, ${colors1?.[2] || '#ff7777'})`,
        padding: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '5px'
      }
      const registerLayout = {
        backgroundImage: `linear-gradient(to bottom right, ${colors2?.[0] || '#7777aa'}, ${colors2?.[1] || '#77aa77'}, ${colors2?.[2] || '#aa7777'})`,
        padding: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '5px'
      }

    

    useEffect(()=>{
        if(!action) return
        fetch('/api/login/'+action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, nemail, cemail, password, homepage})
          })
    }
    , [action, username, email, nemail, cemail, password, homepage])
    
    useEffect(() => { 
      if(!user) return
      router.push(`/${homepage?homepage:'home'}/${user?.username}`)
    },[user?.username, hash])


    return <Container style={{textAlign: 'center', maxWidth: '100vw'}}>
            <Row>
              <Col xs={12}>
                <UserProfile/>
              </Col>
            </Row>
            <Row>
                <Col sm={4} lg={5}></Col>
                <Col xs={12} sm={4} lg={2} style={loginLayout}>
                    <ColorPicker id={'login'} username={user?.username || 'login:admin'} colors={colors1} setColors={setColors1}>
                    {
                        action === 'login'?<LoginForm setHash={setHash}/>
                        :<Button variant="primary" type="submit" onClick={() => {setAction('login')}}>Back to Login</Button>
                    }
                    </ColorPicker>
                </Col>
                <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={loginLayout}>{
                action === 'registernew'?
                <RegisterForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {setAction('registernew')}}>Register New User</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
                <Col sm={4} lg={5}></Col>
                <Col xs={12} sm={4} lg={2} style={{...registerLayout, position: 'relative'}}>
                    <ColorPicker id={'register'} username={user?.username || 'login:admin'} colors={colors2} setColors={setColors2}>
                    {
                        action === 'email'?
                        <UpdateEmailForm homepage={homepage}/>
                        :<Button variant="primary" type="submit" onClick={() => {setAction('email')}}>Update User Email</Button>
                    }
                    </ColorPicker>
                </Col>
                <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={registerLayout}>{/* TODO: password reset email */
                action === 'forgot'?
                <ForgotForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {/*setMethod('forgot')*/}}>{/*'Forgot User Password'*/}</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={registerLayout}>{/* TODO: reset password by email */
                action === 'reset'?
                <PassResetForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {/*setMethod('forgot')*/}}>{/*'Forgot User Email'*/}</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
          </Container>
}


function LoginForm({setHash}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return <Form id={'loginForm'} onSubmit={(event) => {setHash((h)=>{
      console.log('Hash Old', h)
      let newHash = sha224(email+''+password)
      console.log('Hash New', newHash)
      return newHash
    })}}>
    <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="email" name="email" placeholder={"email"} onChange={(e)=>setEmail(e.target.value.toLowerCase())}/>
    </Form.Group>
    <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" name="password" placeholder={"password"} autoComplete={"on"} onChange={(e)=>setPassword(e.target.value)}/>
    </Form.Group>
    <Button type="submit" >Login</Button>
  </Form>
}
function RegisterForm({homepage}){
  return <Form id={'registerForm'}>
        <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control required type="text" name="username" placeholder={"username"}/>
        </Form.Group>
        <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password" placeholder="password" autoComplete={"on"}/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/register"}>Register</Button>
    </Form>
}
function UpdateEmailForm({homepage}){
  return <Form id={'updateForm'}>
        <Form.Group controlId="formEmailNew">
            <Form.Label>New Email address</Form.Label>
            <Form.Control required type="email" name="nemail" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formEmailCurrent">
            <Form.Label>Current Email address</Form.Label>
            <Form.Control required type="email" name="cemail" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control required type="password" name="password" autoComplete={"on"} placeholder="password"/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/update"}>Update</Button>
    </Form>
}
/**
 * TODO
 * @param param0 
 * @returns 
 */
function ForgotForm({homepage}){
  return <Form id={'forgotForm'}>
        <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password" autoComplete={"on"} placeholder="password"/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/forgot"}>Forgot</Button>
    </Form>
}
/**
 * TODO
 * @param param0 
 * @returns 
 */
function PassResetForm({homepage}){
  return <Form id={'forgotForm'}>
        <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password" autoComplete={"on"} placeholder="password"/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/forgot"}>Forgot</Button>
    </Form>
}
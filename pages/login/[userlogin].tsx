import { sha224 } from "js-sha256"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import sql from "../../lib/,base/sql"
import useSWR from 'swr'
import requestIp from 'request-ip'
import Head from "next/head"
import useRegister, { getDB, setDB } from "../../lib/util/registry"

export type User = {
  id: number,
  username: string,
  email: string,
  hash: string,
  access: number,
  ip: string
  message: string,
  homepage: string,
}
const debugAccess='2' 
export type ActiveUser = {
  name: string,
  time: number,
}

/**
 * 
 * USAGE:
 * //to create a user variable
 * const [user, setUser] = useState<User>(null)
 * 
 * //to enable user login data, call Profile to get user information. Note: setActiveUsers is optional
 * <Profile ip={ip} setUser={setUser} setActiveUsers={setActiveUsers}/>
 * 
 * //to enable user login from current page, call LoginNav. Note: style is optional
 * <LoginNav user={user} homepage={homepage} style={style}/>
 * 
 * //to access a list of currently active users, creater this variable and send the setter to Profile
 * const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
 * 
 * //to set a user as active, call
 * activateUser(username)
 * 
 */



export default function UserLogin({ip, homepage}) {
    const router = useRouter()
    const [method, setMethod] = useState(router.query.userlogin)
    const [hash, setHash] = useState(null)
    const [user, setUser] = useState(null)
    const [menu, setMenu] = useState('show')
    const loginLayout = {
      backgroundImage: 'linear-gradient(to bottom right, #4b4, #7c7, #ada)',
      //backgroundColor: '#0c0',
      padding: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      borderRadius: '5px'
    }
    const registerLayout = {
      backgroundImage: 'linear-gradient(to bottom right, #44b, #77c, #aad)',
      //backgroundColor: '#cc0',
      padding: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      borderRadius: '5px'
    }
    const menuLayout = {
      backgroundImage: 'linear-gradient(to bottom right, #557, #77a, #aad)',
      //backgroundColor: '#c0c',
      padding: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      borderRadius: '5px'
    }
    
    useEffect(() => { 
      if(user)router.push({pathname: '/'+homepage/*+'/'+user.username*/, query: {
        username: user.username, email: user.email, access: user.access, message: user.message
      }}
    )},[user])

    return <Container style={{textAlign: 'center', maxWidth: '100vw'}}>
            <Headers/>
            <Row>
              {/**ProfileByIp is used to login if session ip is saved */}
              {/**ProfileByIp will not work if user has logged out */}
              {/*<ProfileByIp ip={ip} setUser={setUser}/>*/}
              {/**Profile is used to login if session is not saved */}
              <Col xs={12}>
                <Profile style={{height: '30vh'}} hash={hash} ip={ip} setUser={setUser}/>
              </Col>
            </Row>
            <Row>
              {/**Menu Dropdown example*/}
              <Col sm={4} md={5}></Col>
              <Col xs={12} sm={4} md={2} style={{visibility: 'collapse', ...menuLayout}}>{'Depricated Nav'/*
                menu === 'show'?<>
                  <Button onClick={() => {setMenu('hide')}}>{'\u21E3'}</Button>
                  <SimpleNav root={"./"} title={"login/login"} links={["login", "logout", "registernew"]} args={''}/>
                </>
                :<Button onClick={() => {setMenu('show')}}>{'\u2911'}</Button>
              */}</Col>
              <Col sm={4} md={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={loginLayout}>{
                method === 'login'?<LoginForm setHash={setHash}/>
                :<Button variant="primary" type="submit" onClick={() => {setMethod('login')}}>Back to Login</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={registerLayout}>{
                method === 'registernew'?
                <RegisterForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {setMethod('registernew')}}>Register New User</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={registerLayout}>{
                method === 'email'?
                <UpdateEmailForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {setMethod('email')}}>Update User Email</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
            <Row>
              <Col sm={4} lg={5}></Col>
              <Col xs={12} sm={4} lg={2} style={registerLayout}>{
                method === 'forgot'?
                <ForgotForm homepage={homepage}/>
                :<Button variant="primary" type="submit" onClick={() => {/*setMethod('forgot')*/}}>{/*'Forgot User Email'*/}</Button>
              }</Col>
              <Col sm={4} lg={5}></Col>
            </Row>
          </Container>
}

/*good example but doesnt work
export function StateToggle( {setState, state, key, name, style, children}){
  return <div style={style}>{
    state===key?
    children
    :<Button onClick={setState(key)}>{name}</Button>
  }</div>
}*/
/**
 * The Head section contains all the complicated important stuff.
 * The brains if you will.
 * 
 * @returns <Head>{els}</Head>
 */
function Headers(){
  return <Head>
              <title>Bridge Login</title>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="keywords" content="" />
              <meta name="description" content="" />
              <link rel="shortcut icon" href="/assets/binary2.png" type="image/x-icon" />
          </Head>
}
function LoginForm({setHash}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return <Form id={'loginForm'} onSubmit={(event) => {event.preventDefault();setHash(sha224(email+''+password))}} >
      <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" name="email" placeholder={"email"} onChange={(e)=>setEmail(e.target.value.toLowerCase())}/>
      </Form.Group>
      <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" name="password" placeholder={"password"} onChange={(e)=>setPassword(e.target.value)}/>
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
            <Form.Control required type="password" name="password" placeholder="password"/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/register"}>Register</Button>
    </Form>
}
function UpdateEmailForm({homepage}){
  return <Form id={'updateForm'}>
        <Form.Group controlId="formEmail">
            <Form.Label>New Email address</Form.Label>
            <Form.Control required type="email" name="nemail" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formEmail">
            <Form.Label>Current Email address</Form.Label>
            <Form.Control required type="email" name="cemail" placeholder={"email"}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control required type="password" name="password" placeholder="password"/>
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
            <Form.Control required type="password" name="password" placeholder="password"/>
        </Form.Group>
        <Form.Group controlId="formHidden">
            <Form.Control required type="hidden" name="homepage" value={homepage} placeholder={homepage}/>
        </Form.Group>
        <Button variant="primary" type="submit" formAction={"/login/forgot"}>Forgot</Button>
    </Form>
}
export const ACTIVEUSERS = 'active_users'
export function Profile(props) {
  const [activeUsers, registerActiveUsers, usersloaded]:[string, Function, boolean] = useRegister(ACTIVEUSERS,[])
  const {ip, setUser, hash, setActiveUsers} = props
  const { data, error } = useSWR('../api/getuserdetails?ip='+ip+(hash&&hash!=null?'&hash='+hash:''), {refreshInterval: 1000})
  const debug = props.debug
  useEffect(() => {
    if(!data) return
    setUser(data)

    console.log('-mounting activeUsers: '+activeUsers)
    console.log('--mounting: '+JSON.stringify(data))
    
    /**SET ACTIVE USERS */
    activateUser(data.username)

    return () => {
      console.log('unmounting: '+JSON.stringify(data))
    }
  },[data,usersloaded])

  useEffect(()=>{
    if(activeUsers&&setActiveUsers)setActiveUsers(activeUsers)//send data to external
  },[activeUsers])

  if (error) {
    return <Row style={props.style}><Col style={{visibility: (debug?'visible':'hidden'), position: (debug?'relative':'absolute')}}>
        {'ERROR:'+JSON.stringify(error)+'\n'}:No such user:{JSON.stringify(props)+'\nDATA:'+JSON.stringify(data)}
      </Col></Row>
  }
  if (!data) return <Row style={props.style}>loading...</Row>
  else {
    let {username, email, access} = data
    data.message = 'Welcome back '+data.username+'!'
    return <div style={{...props.style,
      color: 'white',
      background: 'none repeat scroll 0 0 #000000',
      borderRadius: '20px',
      padding: 12,
      textAlign: 'center',
      border: '2px outset #bbb',
      backgroundImage: 'linear-gradient(to bottom right, #777, #aaa, #ddd, #fff)'
      }}>
        hello {username}!{` \<${email}\> `} Your access level is {access}.
      </div>
  }
}

export async function activateUser(username){
  return getDB(ACTIVEUSERS).then(data=>{
    console.log('activate user '+username+' as '+JSON.stringify(data))
    if(data == null ) return
    if(data == undefined) return
    console.log('starting activate user '+username+' as '+data)
    if(data == 0 || data.length == 0) {setDB(ACTIVEUSERS, [{name: username, time: new Date().getTime()}]); return}
    let actuse = data
    setDB(ACTIVEUSERS, 
      [...actuse.filter(
        ({time, name}) => {
          if(name == username) return false //prevent duplicate user entry
          if((new Date().getTime()) - time > 1000*60*(60/12)) return false//remove users that havent been active in the last hour
          return true
        }
      ), {name: username, time: new Date().getTime()}]
    )
  })
}


/**
 * depricated
 * @param param0 
 * @returns 
 */
export function ProfileByIp({ip, setUser}) {
  const { data, error } = useSWR('/api/getuserdetails?ip='+ip, { revalidateOnFocus: false })
  const debug = true
  useEffect(() => {
    console.log('[ProfileByIp]This function is deprecated. Use Profile instead.');
    setUser(data)
  },[data])
  if (error) {
    return <Row><Col style={{visibility: (debug?'visible':'hidden'), position: (debug?'relative':'absolute')}}>
        {JSON.stringify(error)}:User not cached. Please login or register.
      </Col></Row>
  }
  if (!data) return <div>loading...</div>
  else {
    let {username, email, access} = data
    data.message = 'Welcome back '+data.username+'!'
    return <Row>
        <Col sm={4}></Col>
        <Col sm={4} className={'tcenter'} style={{color: 'white', background: 'gray', borderRadius: '90px'}}>
          hello {username}!{`\<${email}\>`} Your access level is {access}.
        </Col>
        <Col sm={4}></Col>
      </Row>
  }
}

export function LoginNav(props) {
  const { user, homepage, style } = props
  return <a 
        style={style}
        href={
          '/login/' + (user ? 'logout' : 'login') + 
          '?homepage=' + homepage + 
          (user ? '&username=' + user.username : '')
        }>
        {user ? 'Logout ' + user.username : 'Login'}
      </a>
}

/*export async function setUserActive(username: string){
const [activeUsers,setActiveUsers,loaded] = useRegister(ACTIVEUSERS,[])
    if(!activeUsers) setActiveUsers([{name: username, time: new Date().getTime()}]) 
     else setActiveUsers([...JSON.parse(activeUsers).filter( 
       ({time}) => { 
         if(!time) return false 
         if((new Date().getTime()) - time > 1000*60*(60/12)) return false//remove users that havent been active in the last hour 
         return true 
       } 
     ), {name: username, time: new Date().getTime()}])}*/

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const method = query.userlogin
  const username = query.username
  const email = query.email?.toString().toLocaleLowerCase()
  const hash = sha224(query.email?.toString().toLocaleLowerCase()+''+query.password)
  const homepage = query.homepage!=undefined?query.homepage:'bridge'
  const ip = await requestIp.getClientIp(req)
  switch(method){
    case  'logout':
      await sql`Update aspect_users_ SET ip = null WHERE username = ${username}`
      break
    case 'register':
      const [user] = await sql`SELECT * FROM aspect_users_ WHERE hash = ${hash}`
      if (!user) await sql`INSERT INTO aspect_users_ (username, email, hash, access, ip) values (${username}, ${email}, ${hash}, 0, ${ip});`
      break
    case 'update':
      await sql`UPDATE aspect_users_ SET email = ${query.nemail.toString().toLowerCase()}, hash=${sha224(query.nemail.toString().toLocaleLowerCase()+''+query.password)} WHERE hash = ${sha224(query.cemail+''+query.password)}`
      break
    case 'login':
      break
    default:
      break
  } 
  return {props: {ip: ip, homepage: homepage}}
}

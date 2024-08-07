'use client'
import React, { useEffect, useMemo, FC, useState } from 'react'
import {Col, Row} from "react-bootstrap";
import { useRouter } from 'next/navigation';
import UserMenu from '../usermenu';
import useUser from '../../../lib/util/^user';
import Link from 'next/link';
import CodeNotes from '../../../lib/util/-codenotes-';
import ColorPicker, { useColors } from '../../../lib/util/-colorpicker^colors-';
import UserLogin from '../../../lib/util/-userlogin-';

interface pageProps{params: {aspect: string[]}, searchParams}

/**
 * ENTRY POINT
 * @param param0 
 * @returns 
 */
const Page: FC<pageProps> = ({params, searchParams})=>{
    const router = useRouter()
    const {aspect} = params
	const user = useUser()
    const currentUsername = useMemo(()=>user?.username || 'guest',[user])

    useEffect(() => { //too verbose imo
        if(!user) return
        if(currentUsername != aspect[aspect.length-1]){
            let as1 = aspect && aspect[0] != currentUsername ? aspect[0] : null
            as1 = as1!='guest'?as1:null
            let as2 = aspect?.length > 1 && aspect[1] != currentUsername ? aspect[1] : null
            as2 = as2!='guest'?as2:null
            let as3 = aspect?.length > 2 && aspect[2] != currentUsername ? aspect[2] : null
            as3 = as3!='guest'?as3:null
            router.replace(`/home/${as1?as1+'/':''}${as2?as2+'/':''}${as3?as3+'/':''}${currentUsername}`)
        }
    },[user])
    return <Home {...{user, currentUsername, aspect}}/>
}
export default Page

/**
 * PAGE CONTENT
 * @param props 
 * @returns 
 */
function Home(props){
	const {user, aspect} = props
    const [colors, setColors] = useColors(1)
    const [colorz, setColorz] = useColors(1)

    //const mouse = useMousePosition('navi', (e: Event, mousepos: Position)=>{prophet.setNavipos({left: mousepos.left-50, top: mousepos.top-50})})

    function Anchors(){
        return <Row style={{textAlign: 'center'}}>
                    <Col>
                        <Link href={'/home'}><button>Home</button></Link>
                        <Link href={'/home/about'}><button>About</button></Link>
                        <Link href={'/home/profile'}><button>Profile</button></Link>
                        <Link href={'/home/frameworks'}><button>Frameworks</button></Link>
                        <Link href={'/home/tips'}><button>Tips</button></Link>
                        <UserLogin button/>
                    </Col>
            </Row>
    }
    const swtc = ()=>{switch(aspect[0]){
        case 'about':
            return <>
                    <h4>About Us</h4>
                    <p>We exist.</p>
                </>
        case 'profile':
            return <UserMenu user={user} homepage={'home'}/>
        case 'frameworks':
            return <Row>
                        <Col xs={12}>
                            <h4>User Api:</h4>
                            <p>User login is fully implemented accoss all aspectbridge web pages. Accessing user information from any page only requires a simple hook.</p>
                            <code>
                                {"const user = useUser()  //22 code lines incorporated"}<br/>
                            </code>
                        </Col>
                        <Col xs={12}>
                            <h4>Registry Api:</h4>
                            <p>Registry is a proprietary data handling tool. It is siply a way to store state information to a database as a hash map.</p>
                            <p>This is an example implementation. The page name is 'verse'</p>
                            <code>
                                {"const {state, dispatch} = useVerseContext()  //138 code lines incorporated"}<br/>
                                {"const user = useUser()  //22 code lines incorporated"}<br/>
                                {"const [saveLoad, loadSave,] = useUserSave('verse', user?.username, state, (data)=>dispatch({type: 'set', payload: data}))  //40 code lines incorporated"}<br/>
                            </code>
                        </Col>
                    </Row>
        case 'tips':
            return <CodeNotes/>
        default:
            return <>
                    <h4>Disclaimer:</h4>
                    <p>This site is a collection of projects and fragments that are not intrensicly related. The purpose of this site is experimentation with ideas and design principals.</p>
                </>
    }}

    return <div id={'navi'}>
        <Row id={aspect[0]} className={'justify-content-md-center'} style={{position: 'relative'}}>
            
            <Col xs={12} style={{backgroundColor: colors[0] || 'grey', transition: 'background-color 1s eas-in-out'}}>
                <Anchors/>
            </Col>

            <Col xs={12} style={{backgroundColor: colorz[0] || 'white', transition: 'background-color 1s linear'}}>
                {swtc()}
            </Col>

        </Row>
        
        {//<Navi {...{prophet, mouseClickPos: mouse.clickpos, message: 'this is a message'}}/>
}
        </div>
}
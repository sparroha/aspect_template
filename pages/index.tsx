import React, { use, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BuildContents, BuildRow, ColBuilder, ContentBuilder, RowBuilder } from '../components/page_builder'
import { ActiveUser, LoginNav, Profile, activateUser } from './login/[userlogin]'
import { GetServerSideProps } from 'next'
import requestIp from 'request-ip';
import { useVectorTransition } from '../components/vectortransition'

export default function Index(props) {
	const [user, setUser] = React.useState(null)
	const [activeUsers, setActiveUsers]:[ActiveUser[], Function] = React.useState([])
	/*useEffect(()=>{//LOL copilot made a sily anchor tag handler
		const clickHandler = (e)=>{
			if(e.target.tagName.toLowerCase()=='a'){
				e.preventDefault()
				const href = e.target.getAttribute('href')
				window.history.pushState({}, '', href)
				const navEvent = new PopStateEvent('popstate')
				window.dispatchEvent(navEvent)
			}
		}
		window.addEventListener('click', clickHandler)
		return ()=>{
			window.removeEventListener('click', clickHandler)
		}
	}, [])*/
	useEffect(()=>{
		const clickHandler = (e)=>{
			if(user)activateUser(user.username)
		}
		window.addEventListener('click', clickHandler)
		return ()=>{
			window.removeEventListener('click', clickHandler)
		}
	}, [user])

	const displayActiveUsers: ColBuilder = {
		id: 'active-users',
		label: 'Column 1',
		content: <div>
					<h2>Active Users</h2>
					<ul>
						{activeUsers.map((u, i)=>{
							return <li key={i}>{u.name}: last active {Math.floor((new Date().getTime()-u.time)/60000)} min ago</li>
						})}
					</ul>
				</div>,
		style: {
			backgroundColor: 'red',
			color: 'white'
		}
	}
	const userDetails: RowBuilder = {
		id: 'user-details',
		cols: [
			{
				id: 'user',
				label: 'User Details',
				content: <Profile ip={props.ip} setUser={setUser} setActiveUsers={setActiveUsers}/>,
				style: {
					backgroundColor: '#aaa',
					color: 'black',
					padding: 12
				}
			}
		]
	}
	const userLogin: RowBuilder = {
		id: 'user-login',
		cols: [
			{
				id: 'user',
				label: 'User Login',
				content: <LoginNav user={user} homepage={'index'} />,
				style: {
					backgroundColor: '#ccc',
					color: 'black'
				}
			}
		]
	}
	const userRow: ContentBuilder = {
		id: 'user-row',
		rows: [userDetails, userLogin]
	}

	const {center, bounds, nextVector, nextPosition, setNextVector, setNextPosition} = useVectorTransition()

	return <Container>
		<Row>
			<Col>
				<h1 style={{...nextPosition, transition: 'left 1s, top 1s', transitionTimingFunction: 'linear', position: 'absolute', border: '5px outset grey', backgroundColor: '#888'}}
				onClick={()=>setNextPosition((last)=>{
					let w = window.innerWidth/2
					let h = window.innerHeight/2
					let l = Math.random()*(w)-w/2
					let t = Math.random()*(h)-h/2

					return {left: last.top+l, top: last.top+t}
					})}>Hello World!</h1>
			</Col>
		</Row>
		<BuildRow id={'row-1'} cols={[
			{
				id: 'col-1',
				label: 'Column 1',
				content: `NextVector: ${JSON.stringify(nextVector)}`,
				style: {
					backgroundColor: 'red',
					color: 'white'
				}
			},
			{
				id: 'col-2',
				label: 'Column 2',
				content: `NextPosition: ${JSON.stringify(nextPosition)}`,
				style: {
					backgroundColor: 'blue',
					color: 'white'
				}
			},
			{
				id: 'col-3',
				label: 'Column 3',
				content: <a href={'testautobuild'}>Test Autobuild</a>,
				style: {
					backgroundColor: 'green',
					color: 'white'
				}
			}
		]}/>
		<BuildRow id={'row-2'} cols={[
			{
				id: 'user',
				label: '',
				content: <BuildContents {...userRow}/>,
				style: {
					marginTop: 0
				}
			},
			displayActiveUsers
		]}/>
	</Container>
}

//FOR TS: TypeScript
console.log('Hello World!')

export const getServerSideProps: GetServerSideProps = async (context) => {
    const query = context.query
    const ip = await requestIp.getClientIp(context.req)
    return {props: {ip: ip}} 
}
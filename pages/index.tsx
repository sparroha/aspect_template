import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BuildContents, BuildRow, ColBuilder, ContentBuilder, RowBuilder } from '../components/page_builder'
import { LoginNav, Profile } from './login/[userlogin]'
import { GetServerSideProps } from 'next'
import requestIp from 'request-ip';

export default function Index(props) {
	const [user, setUser] = React.useState(null)
	const [activeUsers, setActiveUsers] = React.useState([])

	const displayActiveUsers: ColBuilder = {
		id: 'active-users',
		label: 'Column 1',
		content: <div>
					<h2>Active Users</h2>
					<ul>
						{activeUsers/*.map((u, i)=>{
							return <li key={i}>{u}</li>
						})*/}
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

	return <Container>
		<Row>
			<Col>
				<div>
					<h1 onClick={()=>alert()}>Hello World!</h1>
				</div>
			</Col>
		</Row>
		<BuildRow id={'row-1'} cols={[
			{
				id: 'col-1',
				label: 'Column 1',
				content: 'This is column 1',
				style: {
					backgroundColor: 'red',
					color: 'white'
				}
			},
			{
				id: 'col-2',
				label: 'Column 2',
				content: 'This is column 2',
				style: {
					backgroundColor: 'blue',
					color: 'white'
				}
			},
			{
				id: 'col-3',
				label: 'Column 3',
				content: 'This is column 3',
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
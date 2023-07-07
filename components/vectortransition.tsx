import React, { useEffect } from "react"
export type Vector = {x: number, y: number}
export type Position = {left: number, top: number}
export type Bounds = {left: number, right: number, top: number, bottom: number}
export type Behavior = {bounce: boolean, wrap: boolean, gravity: boolean}

export default function VecObj(props: {id: string, style?: {}, position?: Position, vector?: Vector, bounds?: Bounds, behavior?: Behavior}){
	const {id, style, position, vector, bounds, behavior} = props
    const [center, setCenter] = React.useState(null)
	const [currentBounds, setBounds] = React.useState(bounds || null)
	const [nextPosition, setNextPosition] = React.useState(position || {left: 0, top: 0})
	const [nextVector, setNextVector] = React.useState(vector || {x: 1, y: 1})
	const deltaRate = 200
	const speed = 1
	useEffect(()=>{
		if(!center)setCenter({left: window.innerWidth/2, top: window.innerHeight/2})
		if(!bounds)setBounds({left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight})
	}, [])
	useEffect(()=>{

		setNextPosition(position || {left: 5, top: 5})
		setNextVector(vector || {x: 1, y: 1})
	}, [position, vector])

	useEffect(()=>{
		if(!nextPosition)return
		if(!nextVector)return
		if(!currentBounds)return
		let f = ()=>setNextPosition((last)=>{
			let nextX = last.left+nextVector.x
			let nextY = last.top+nextVector.y
			if(nextX<currentBounds.left||nextX>currentBounds.right)nextVector.x*=-1
			if(nextY<currentBounds.top||nextY>currentBounds.bottom)nextVector.y*=-1
			return {left: nextX, top: nextY}
		})
		const interval = setInterval(f, deltaRate)
		return ()=>clearInterval(interval)
	}, [nextVector])
	useEffect(()=>{
		let mutate = ()=>{
			setNextPosition(position || {left: 5, top: 5})
			setNextVector(vector || {x: 1, y: 1})
		}
		/*let f = ()=>setNextVector((last)=>{
			let nextX = last.x+(Math.random()*10-5)
			let nextY = last.y+(Math.random()*10-5)
			return {x: nextX, y: nextY}
		})*/
		const interval = setInterval(mutate, deltaRate)
		return ()=>clearInterval(interval)
	}, [])

	//BEHAVIOR
	useEffect(()=>{
		if(!behavior)return
		if(!nextPosition)return
		if(!nextVector)return
		if(!currentBounds)return
		let f = ()=>{
			if(behavior.bounce){
				if(nextPosition.left<currentBounds.left){
					setNextPosition((last)=>{return {...last, left: currentBounds.left}})
					setNextVector((last)=>{return {...last, x: -last.x}})
				}
				if(nextPosition.left>currentBounds.right){
					setNextPosition((last)=>{return {...last, left: currentBounds.right}})
					setNextVector((last)=>{return {...last, x: -last.x}})
				}
				if(nextPosition.top<currentBounds.top){
					setNextPosition((last)=>{return {...last, top: currentBounds.top}})
					setNextVector((last)=>{return {...last, y: -last.y}})
				}
				if(nextPosition.top>currentBounds.bottom){
					setNextPosition((last)=>{return {...last, top: currentBounds.bottom}})
					setNextVector((last)=>{return {...last, y: -last.y}})
				}
			}
			if(behavior.wrap){
				if(nextPosition.left<currentBounds.left){
					setNextPosition((last)=>{return {...last, left: currentBounds.right}})
				}
				if(nextPosition.left>currentBounds.right){
					setNextPosition((last)=>{return {...last, left: currentBounds.left}})
				}
				if(nextPosition.top<currentBounds.top){
					setNextPosition((last)=>{return {...last, top: currentBounds.bottom}})
				}
				if(nextPosition.top>currentBounds.bottom){
					setNextPosition((last)=>{return {...last, top: currentBounds.top}})
				}
			}
			if(behavior.gravity){
				setNextVector((last)=>{return {...last, y: last.y+0.1}})
			}
		}
		const interval = setInterval(f, deltaRate)
		return ()=>clearInterval(interval)
	}, [nextPosition, nextVector, currentBounds, behavior])


    return <div id={id} style={{...style, position: 'absolute', ...nextPosition, transition: 'left 1s, top 1s', transitionTimingFunction: 'linear'}}>
		{JSON.stringify(nextVector)}
	</div>
}
export function useVectorTransition(){
    const [center, setCenter] = React.useState({left: 0, top: 0})
	const [bounds, setBounds] = React.useState({left: 0, right: 0, top: 0, bottom: 0})
	const [nextPosition, setNextPosition] = React.useState({left: 0, top: 0})
	const [nextVector, setNextVector] = React.useState({x: 0, y: 0})
	useEffect(()=>{
		setCenter({left: window.innerWidth/2, top: window.innerHeight/2})
		setBounds({left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight})
	}, [])
	//LINEAR TRANSITION
	/*useEffect(()=>{return
		let f = ()=>setNextPosition((last)=>{
			let nextX = (Math.random()*200-100)+last.left
			let nextY = (Math.random()*200-100)+last.top
			if(nextX<bounds.left)nextX=bounds.left
			if(nextX>bounds.right)nextX=bounds.right
			if(nextY<bounds.top)nextY=bounds.top
			if(nextY>bounds.bottom)nextY=bounds.bottom
			return {left: nextX, top: nextY}
		})
		const interval = setInterval(f, 1000)
		return ()=>clearInterval(interval)
	}, [])*/

	//VECTOR TRANSITION
	useEffect(()=>{
		let f = ()=>setNextPosition((last)=>{
			let nextX = last.left+nextVector.x
			let nextY = last.top+nextVector.y
			if(nextX<bounds.left||nextX>bounds.right)nextVector.x*=-1
			if(nextY<bounds.top||nextY>bounds.bottom)nextVector.y*=-1
			return {left: nextX, top: nextY}
		})
		const interval = setInterval(f, 200)
		return ()=>clearInterval(interval)
	}, [nextVector])
	useEffect(()=>{
		let f = ()=>setNextVector((last)=>{
			let nextX = last.x+(Math.random()*10-5)
			let nextY = last.y+(Math.random()*10-5)
			return {x: nextX, y: nextY}
		})
		const interval = setInterval(f, 5000)
		return ()=>clearInterval(interval)
	}, [])

    return {center, bounds, nextVector, nextPosition, setNextVector, setNextPosition}
}
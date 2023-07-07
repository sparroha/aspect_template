import React, { useEffect } from "react"

export default function useVectorTransition(){
    const [center, setCenter] = React.useState({left: 0, top: 0})
	const [bounds, setBounds] = React.useState({left: 0, right: 0, top: 0, bottom: 0})
	const [nextPosition, setNextPosition] = React.useState({left: center.left, top: center.top})
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
import { useMousePosition } from '../components/mouse'
import BuildPage, { BuildContents, BuildRow, ColBuilder, ContentBuilder, RowBuilder } from '../components/page_builder'
import VecObj, { useVectorTransition } from '../components/vectortransition'
export default function Auto(props){
    
	const vectorA = useVectorTransition()
	const vectorB = useVectorTransition()
    const mouse = useMousePosition('nest', (clickEvent)=>{}, (contextEvent)=>{console.log('context')})
    return <div id={'nest'}>

        <button onClick={()=>{
            vectorA.setNextPosition({left: 300, top: 300})
        }}>Move A</button>
        <VecObj id={'vec-1'} behavior={{bounce: false, wrap: false, gravity: true}} style={{width: 72, height: 22, backgroundColor: 'blue'}}/>

        <div id={'vectorA'} style={{position: 'absolute', ...vectorA.nextPosition, transition: 'left 1s, top 1s', transitionTimingFunction: 'linear', width: 22, height: 22, backgroundColor: 'red'}}></div>
		<div id={'vec-2'} style={{position: 'absolute', ...vectorB.nextPosition, transition: 'left 1s, top 1s', transitionTimingFunction: 'linear', width: 22, height: 22, border: '1px solid black'}}></div>
    </div>
}
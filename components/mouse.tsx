import { useEffect, useState } from "react";

export type Position = {left: number, top: number}
export type MouseProps = {mousepos: Position, clickpos: Position, lastClickpos: Position, trate: number}
/**
 * 
 * @param props id, setMouse
 * @returns 
 */
export default function Mouse(props) {
    const {id, setMouse, children} = props
    const {mousepos, clickpos, lastClickpos, trate} = useMousePosition('#mousepos-'+id, (e, mousepos) => {}, () => {}, id);
    useEffect(() => {
        setMouse(()=> {return {mousepos, clickpos, lastClickpos, trate}})
        //console.log('setMouse', mousepos, clickpos)
    }, [mousepos, clickpos]);
    const [marketToggle, setMarkerToggle] = useState(false)
    
    return <div id={'mouse-'+id}>
            <div id={'mousepos-'+id} hidden={!props.debug}>{Math.floor(mousepos?mousepos.left:0)+'/'+Math.floor(mousepos?mousepos.top:0)}</div>
            <div id={'clickpos-'+id} hidden={!props.debug}>Click: {Math.floor(clickpos?clickpos.left:0)+'/'+Math.floor(clickpos?clickpos.top:0)}</div>
            <div id={'clickpos-'+id} hidden={!props.debug}>Last Click: {Math.floor(lastClickpos?lastClickpos.left:0)+'/'+Math.floor(lastClickpos?lastClickpos.top:0)}</div>
            <div id={'clickpos-'+id+'-marker'} hidden={!marketToggle} style={{position: 'absolute', left: clickpos.left, top: clickpos.top, transition: 'left '+trate+'ms linear, top '+trate+'ms linear', width: 5, height: 5, borderRadius: '50px', backgroundColor: 'blue'}}>marker: {trate+'s'}</div>
            <input type={'checkbox'} id={'clickpos-'+id+'-marker-toggle'} style={{position: 'absolute', right: 0, top: 0, width: 10, height: 10, borderRadius: '50px', backgroundColor: 'blue'}} value={marketToggle?'true':'false'} onChange={(e)=>{setMarkerToggle(!marketToggle)}}/>
            {children?children:null}
        </div>
        
}
/**
 * 
 * @param screenid selector
 * @param onClick 
 * @param onContext 
 * @returns 
 */
export function useMousePosition(screenid, onClick?: (e: Event, mousepos: Position)=>void, onContext?: Function, id?: string) {
    const [screen, setScreen] = useState(null)
    const [mousepos, setMousepos] = useState({left: 0, top: 0});
    const [clickpos, setClickpos] = useState({left: 0, top: 0});
    const [lastClickpos, setLastClickpos] = useState({left: 0, top: 0});
    const stepDistance = 500
    const [trate, setTrate] = useState(1)
    useEffect(()=>{
        if(!screen)return
        setTrate((lt)=>{
            let pos = (mousepos.left == 0 && mousepos.top == 0)?lastClickpos:mousepos
            let marker = objOffset(document.querySelector('#clickpos-'+id+'-marker'));
            let vctr = {left: pos.left - marker.left, top: pos.top - marker.top}
            let vctrlen = Math.sqrt(vctr.left*vctr.left+vctr.top*vctr.top)
            let t = vctrlen/stepDistance
            return t!=0?t:lt
        })
    },[mousepos])
    useEffect(() => {
        if (!screen) return setScreen(document.querySelector(screenid));

        window.onmousemove = (event) => {
            event = event || window.event; // IE-ism
            let offset = objOffset(screen);
            setMousepos({
                left: event.clientX-offset.left,
                top: event.clientY-offset.top
            });
        }
        window.onclick = (event) => {
            event = event || window.event; // IE-ism
            let offset = objOffset(screen);
            setMousepos((mousepos) => {
                setClickpos((clickpos)=>{
                    setLastClickpos(clickpos)
                    return mousepos
                });
                onClick(event, mousepos)//not calling?
                return mousepos
            });

        } 
        window.oncontextmenu = function handleContextMenue(event) {
            //() => window.onclick(event);
            onContext();
            return true;
        };
    }, [screen, onClick, onContext]);
    return {mousepos, clickpos, lastClickpos, trate: (trate*1000).toFixed(2)};
}
export function objOffset(obj: HTMLMapElement){
    var left = 0;
    var top = 0;
    if (obj.offsetParent) {
        left += obj.getBoundingClientRect().left;
        top  += obj.getBoundingClientRect().top;
        return {
            left : left,
            top : top
        };
        //obj = obj.offsetParent;
        //console.log("@engine-100{left: "+$(obj).offset().left+", top: "+top+", obj: "+obj+"}")
    } 
    
    return {
        left : left,
        top : top
    };
}
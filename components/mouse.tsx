import { useEffect, useState } from "react";

export default function Mouse(props) {
    const {mousepos, clickpos} = props
    const mouse = useMousePosition('#mousepos', (e, mousepos) => {}, () => {});
    return <><div id={'mousepos'}>{Math.floor(mousepos?mousepos.x:mouse.mousepos.x)+'/'+Math.floor(mousepos?mousepos.y:mouse.mousepos.y)}</div><br/><div id={'clickpos'}>Last clicked: {Math.floor(clickpos?clickpos.x:mouse.clickpos.x)+'/'+Math.floor(clickpos?clickpos.y:mouse.clickpos.y)}</div></>
}
export function useMousePosition(screenid, onClick: { (e: Event, mousepos: { x: number; y: number; }): void }, onContext: Function) {
    const [screen, setScreen] = useState(null)
    const [mousepos, setMousepos] = useState({x:0,y:0});
    const [clickpos, setClickpos] = useState({x:0,y:0});
    useEffect(() => {
        if(screen){
            window.onmousemove = (event) => {
                event = event || window.event; // IE-ism
                let offset = objOffset(screen);
                setMousepos({
                    x:event.clientX-offset.x,
                    y:event.clientY-offset.y
                });
            }
            window.onclick = (event) => {
                event = event || window.event; // IE-ism
                let offset = objOffset(screen);
                setMousepos((mousepos) => {
                    let mp = {
                        x:event.clientX-offset.x,
                        y:event.clientY-offset.y
                    }
                    setClickpos(mp);
                    onClick(event, mp)
                    return mp
                });
            } 
            window.oncontextmenu = function handleContextMenue(event) {
                //() => window.onclick(event);
                onContext();
                return false;
            };
        }else setScreen(document.querySelector(screenid))
    }, [screen]);
    return {mousepos, clickpos};
}
function objOffset(obj: HTMLMapElement){
    var left = 0;
    var top = 0;
    if (obj.offsetParent) {
        left += obj.getBoundingClientRect().left;
        top  += obj.getBoundingClientRect().top;
        return {
            x : left,
            y : top
        };
        //obj = obj.offsetParent;
        //console.log("@engine-100{left: "+$(obj).offset().left+", top: "+top+", obj: "+obj+"}")
    } 
    
    return {
        x : left,
        y : top
    };
}
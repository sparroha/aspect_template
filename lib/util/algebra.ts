export class algbraic{
    static log = (b?: number)=>(x: number)=>{return Math.log(x) / Math.log(b || Math.E)}
    static slope = {
        m: (x1: number, y1: number, x2: number, y2: number)=>{return (y2 - y1) / (x2 - x1)},
        b: (x: number, y: number, m: number)=>{return y - m * x},
        y: (m: number, x: number, b: number)=>{return m * x + b},
        x: (m: number, y: number, b: number)=>{return (y - b) / m}
    }
    static quadratic = (a: number, b: number, c: number)=>{
        let rt = Math.sqrt(b * b - 4 * a * c)
        let a2 = 2 * a
        return [
            (-b + rt) / a2, 
            (-b - rt) / a2
        ]
    }   
} 
export class Logic{
    //both are true
    static and(a: boolean, b: boolean){
        return a && b
    }
    //at least one is true
    static or(a: boolean, b: boolean){
        return a || b
    }
    //opposite of
    static not(a: boolean){
        return !a
    }
    //only one is true
    static xor(a: boolean, b: boolean){
        return a !== b
    }
    //neither are true
    static nand(a: boolean, b: boolean){
        return !(a && b)
    }
    //neither are true
    static nor(a: boolean, b: boolean){
        return !(a || b)
    }
    //both are same 
    static xnor(a: boolean, b: boolean){
        return a === b
    }
}
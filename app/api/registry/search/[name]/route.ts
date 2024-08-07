import { NextResponse } from "next/server";
import sql from "../../../../../lib/,base/sql";

export async function GET(req: Request, res: Response) {
    const url = new URL(req.url);
    const params = url.pathname
    const create: boolean =  url.searchParams.get('create')=='true'? true : false;
    const name = params.substring(params.lastIndexOf('/')+1)
    if (!name) return NextResponse.json({ alert: 'no name found', url: url, search: url.searchParams });
    
    const search = await sql`SELECT * FROM aspect_registry_;`
    let fsearch = search.filter((item)=>item.name.includes(name))
    console.log('/api/registry/search/['+name+'].POST', search)
    return NextResponse.json(fsearch)
}
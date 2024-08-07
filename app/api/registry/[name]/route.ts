import { NextResponse } from "next/server";
import sql from "../../../../lib/,base/sql";

export async function GET(req: Request, res: Response) {
    const url = new URL(req.url);
    const params = url.pathname
    const create: boolean =  url.searchParams.get('create')=='true'? true : false;
    const name = params.substring(params.lastIndexOf('/')+1)
    if (!name) return NextResponse.json({ alert: 'no name found', url: url, search: url.searchParams });
    const [register] = await sql`SELECT * FROM aspect_registry_ WHERE name = ${name};`
    if (register) {return NextResponse.json({data: register.registry_data})}
    
    if(!create) return NextResponse.json({ alert: 'no registry found' })
    let newR = await sql`INSERT INTO aspect_registry_ (name, registry_data) VALUES (${name}, ${"default"}) ON DUPLICATE KEY UPDATE registry_data = ${"default"};`
    const [newregister] = await sql`SELECT * FROM aspect_registry_ WHERE name = ${name};`
    if (!newregister) return NextResponse.json({ final: 'no registry found' })
    return NextResponse.json({ data: newregister.registry_data, sqlresponse: newR})
}
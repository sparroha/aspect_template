import { NextResponse } from "next/server";
import sql from "../../../../../../lib/,base/sql";

export async function GET(req: Request, res: Response) {
    const url = new URL(req.url);
    const params = url.pathname
    const create: boolean =  url.searchParams.get('create')=='true'? true : false;
    const id = Number.parseInt(params.substring(params.lastIndexOf('/')+1))
    if (!id) return NextResponse.json({ alert: 'no name found', url: url, search: url.searchParams });
    const del = await sql`DELETE FROM aspect_registry_ WHERE id = ${id};`
    console.log('/api/registry/delete/id/['+id+'].POST', del)
    return NextResponse.json({data: del})
}
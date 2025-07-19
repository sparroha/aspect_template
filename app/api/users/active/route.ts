import { NextResponse } from "next/server";
import sql from "../../../../lib/,base/sql";
import { RegistryEntry } from "../../registry/route";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export type ActiveUser = {
    name: string,
    access: number,
    time: number
}

export async function GET(req, res): Promise<NextResponse<{data: ActiveUser[]}>>{
    const ACTIVEUSERS = 'active_users'
    //const nonuser: ActiveUser = {name: '420: No Users Active', access: 2, time: Date.now()}
    //let regdata: ActiveUser[] = []
    const [users]: [RegistryEntry] = await sql`SELECT * FROM aspect_registry_ WHERE name = ${ACTIVEUSERS};`
    const usersData: ActiveUser[] = users?JSON.parse(users.registry_data):[]
    if(!users) return NextResponse.json({data: []})
    
    return NextResponse.json({data: usersData})
}
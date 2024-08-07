import { NextRequest, NextResponse } from "next/server";
import sql from "../../../../lib/,base/sql";
import { sha224 } from "js-sha256";

export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({ alert: 'GET not allowed'});
}
export async function POST(req: NextRequest, res: NextResponse) {
    try{
        const url = new URL(req.url);
        const params = url.pathname
        const method = params.substring(params.lastIndexOf('/')+1)
        const { username, password, hash, email, nemail, cemail} = await req.json();
        alert(req.body)
        switch (method) {
            case 'logout':
                return logout(username)
            case 'register':
                return register(hash, username, email)
            case 'update':
                return update(nemail, cemail, password)
            default:
                return NextResponse.json({ alert: 'no method found'});
        }
    }catch(e){
        return NextResponse.json({ alert: 'error:'+ e});
    }
}

async function logout(username){
    await sql`Update aspect_users_ SET ip = null WHERE username = ${username}`
    return NextResponse.json({ alert: 'logged out' })
}
async function register(hash, username, email){
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE hash = ${hash}`
    if (!user) await sql`INSERT INTO aspect_users_ (username, email, hash, access) values (${username}, ${email}, ${hash}, 0);`
    return NextResponse.json({ alert: 'registered' })
}
async function update(nemail, cemail, password){
    await sql`UPDATE aspect_users_ SET email = ${nemail}, hash=${sha224(nemail+''+password)} WHERE hash = ${sha224(cemail+''+password)}`
    return NextResponse.json({ alert: 'updated' })
}
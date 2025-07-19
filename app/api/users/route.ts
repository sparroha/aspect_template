import { NextResponse } from "next/server";
import sql from "../../../lib/,base/sql";
import { RegistryEntry } from "../registry/route";

export type RegistryFetch = { data?: string, sqlresponse?: any, alert?: string}

export async function GET(req: Request, res: Response) {
    const allusers: RegistryEntry[] = await sql`SELECT username FROM aspect_users_;`
    if (!allusers) return NextResponse.json({ alert: 'no registries found' });
    return NextResponse.json(allusers)
}
//UNTESTED
export async function POST(req: Request, res: Response) {
    const body = await req.json();
    return NextResponse.json({ sqlresponse: 'nill' });
}
                
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username } = req.body;
    await sql`INSERT INTO aspect_chat_users_ (username) VALUES (${username}) ON DUPLICATE KEY UPDATE last_active = NOW();`;
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    const result = await sql`SELECT * FROM aspect_chat_users_ WHERE TIMESTAMPDIFF(SECOND, last_active, NOW()) <= 10;`;
    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const { username } = req.body;
    await sql`DELETE FROM aspect_chat_users_ WHERE username = ${username};`;
    res.status(200).json({ success: true });
  } else if (req.method === 'MKTBL') {
    const result = await sql`CREATE TABLE IF NOT EXISTS aspect_chat_users_ (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        last_active DATETIME NOT NULL
      );`;
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
*/
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    const body = await req.json();
    return NextResponse.json({ sqlresponse: 'nill' });
}
//UNTESTED
export async function POST(req: Request, res: Response) {
    const body = await req.json();
    return NextResponse.json({ sqlresponse: 'nill' });
}

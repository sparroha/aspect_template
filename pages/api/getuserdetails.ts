import sql from "../../lib/,base/sql";

export default async function getUserDetails(req, res) {
    const { email, username, hash, ip, command} = req.query;
    let user = null
    if(ip){
        if (hash&&hash!=null) user = await getUserByHash(hash, ip)
        else user = await getUserByIp(ip)
    }
    else if( email ) user = await getUserByEmail(email)
    else if( username ) user = await getUserByUsername(username)
    else if( command == 'getall') user = await getAllUsers()
    else return res.status(400).json({message: 'No email, username or hash provided.'})
    res.status(200).json(user);
}
async function getUserByHash(hash, ip) {
    const [user] = await sql`SELECT username, email, access FROM aspect_users_ WHERE hash = ${hash}`
    if (user) await sql`Update aspect_users_ SET ip = ${ip} WHERE hash = ${hash}`
    return user
}
async function getUserByEmail(email) {
    const [user] = await sql`SELECT username, email, access FROM aspect_users_ WHERE email = ${email}`
    return user
}
async function getUserByUsername(username) {
    const [user] = await sql`SELECT username, email, access, hash FROM aspect_users_ WHERE username = ${username}`
    return user
}
async function getHashByIp(ip) {
    const [hash] = await sql`SELECT hash FROM aspect_users_ WHERE ip = ${ip}`
    return hash
}
async function getUserByIp(ip) {
    const [user] = await sql`SELECT username, email, access FROM aspect_users_ WHERE ip = ${ip}`
    return user || await getUserByHash(await getHashByIp(ip), ip)
}
async function getAllUsers() {
    const user = await sql`SELECT username, email, access FROM aspect_users_ WHERE 1`
    return user
}

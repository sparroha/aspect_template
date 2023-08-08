import sql from "../../lib/,base/sql";
import { User } from "../login/[userlogin]";
//url params use query
//form submits use query
//fetch uses body
export default async function getUserDetails(req, res): Promise<Partial<User>> {
    const { email, username, hash, ip, command, id} = req.query;
    let user = null
    if(command) switch(command){
        case 'getall':
            user = await getAllUsers()
            if(!user) return res.status(400).json({message: 'No users found.'})
            return res.status(200).json(user);
            break;
        case 'delete':
            if(!username) return res.status(400).json({message: 'No username provided.'})
            let deluser = await deleteUser(username)
            return res.status(200).json(deluser);
            break;
        case 'deleteid':
            if(!id) return res.status(400).json({message: 'No id provided.'})
            let deluserid = await deleteUserById(id)
            return res.status(200).json(deluserid);
            break;
        case 'sethashid':
            if(!hash) return res.status(400).json({message: 'No hash provided.'})
            if(!id) return res.status(400).json({message: 'No id provided.'})
            let uhash = await setHashById(hash, id)
            return res.status(200).json(uhash);
            break;
        case 'getbyemail':
            break;
        case 'getbyusername':
            break;
        default:
            break;
    }
    else if(ip){
        if (hash&&hash!=null) user = await getUserByHash(hash, ip)
        else user = await getUserByIp(ip)
    }
    else if( email ) user = await getUserByEmail(email)
    else if( username ) user = await getUserByUsername(username)
    else return res.status(400).json({message: 'No email, username or hash provided.'})
    return res.status(200).json(user);
}
//ONLY FOR LOGIN
async function getUserByHash(hash, ip) {
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE hash = ${hash}`
    if (user) await sql`Update aspect_users_ SET ip = ${ip} WHERE hash = ${hash}`
    return user
}//4194b857972439ee6bd294b9889c2ebec9cbbaa03a9312a16935225c
async function setHashById(hash: string, id: number) {
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE id = ${id}`
    let resp = user?await sql`Update aspect_users_ SET hash = ${hash} WHERE id = ${id}`:null
    return resp
}
async function getUserByEmail(email) {
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE email = ${email}`
    return user
}
async function getUserByUsername(username) {
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE username = ${username}`
    return user
}
async function getHashByIp(ip) {
    const [hash] = await sql`SELECT hash FROM aspect_users_ WHERE ip = ${ip}`
    return hash
}
async function getUserByIp(ip) {
    const [user] = await sql`SELECT * FROM aspect_users_ WHERE ip = ${ip}`
    return user || await getUserByHash(await getHashByIp(ip), ip)
}
async function getAllUsers() {
    const user = await sql`SELECT * FROM aspect_users_ WHERE 1`
    return user
}

async function deleteUser(username) {
    const data = await sql`DELETE FROM aspect_users_ WHERE username = ${username}`
    return data
}
async function deleteUserById(id) {
    const data = await sql`DELETE FROM aspect_users_ WHERE id = ${id}`
    return data
}
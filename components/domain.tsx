import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Determines the root domain and redirects to the appropriate page
 * @param props 
 */
export default function useDomainRoot(props){
    const router = useRouter()
    const domain = getDomain()
    const [username, ] = useState(props.username?props.username:'')
    useEffect(() => {
        
        console.log('@useDomainRoot('+domain+'||'+window.location.href+')')
        if(domain != 'localhost:3000/'){
            //if loading from 'aspectbridge.' or 'www.' then redirect to [...aspect]
            if(domain == "aspectbridge" || domain == "www"){router.push('/home/'+(username?username:'')+'?domain='+domain)}
        }
        return ()=> {
            /**
             * In this configuration, the only accessable pages are the root [...slug] pages
             */
        }
    }, [domain]);
}
export function getDomain(){
    const [domain, setDomain] = useState('')
    
    useEffect(() => {
        let d = /:\/\/([^\.]+)/.exec(window.location.href)
        if(d) setDomain(d[1])
    })
    return domain
}

import httpInstance from './ApiConfig'


export default function Delete(props){
    return httpInstance.delete(props.url, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${props.access_token}`,
            "Accept": "application/json",
        }
    })

}
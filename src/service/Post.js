import httpInstance from './ApiConfig';

export default function Post(props){
    const data = props.data
    let config = {}

    if(props.header){
        config = {
            headers: { 
                "Authorization": `Bearer ${props.access_token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
    }else{
        config = {
            headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
    }

    
    return httpInstance.post(props.url, data, config)
}
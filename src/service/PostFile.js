import httpInstance from './ApiConfig';

export default function PostFile(props){
    const data = props.data
    let config = {}

    config = {
        headers: { 
            "Authorization": `Bearer ${props.access_token}`,
            "Accept": "application/json",
            "Content-Type": "multipart/form-data"
        }
    };
   

    
    return httpInstance.post(props.url, data, config)
}

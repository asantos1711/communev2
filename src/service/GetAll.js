import httpInstance from './ApiConfig'



function GetAll(props){   

    return Promise.all(props.urls.map(fetchData))
    function fetchData(URL) {
        return httpInstance.get(URL, {
            headers: {
                "Authorization": `Bearer ${props.access_token}`,
                "Accept": "application/json",
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

}

export default GetAll

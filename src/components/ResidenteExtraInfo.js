import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { useRouteMatch, Link } from 'react-router-dom'
import { BsList } from 'react-icons/bs';

export default function ResidenteExtraInfo(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><BsList /> Habitantes</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/tipo-numero-telefono`} className="btn btn-outline-secondary btn-sm">Tipo número teléfono </Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
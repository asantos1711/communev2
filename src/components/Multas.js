import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { useRouteMatch, Link } from 'react-router-dom'
import { RiAlarmWarningLine } from "react-icons/ri";

export default function Multas(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><RiAlarmWarningLine /> Sanciones</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/tipo-multa`} className="btn btn-outline-secondary btn-sm">Tipos</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
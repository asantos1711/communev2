import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { BsBuilding } from "react-icons/bs";
import { Link, useRouteMatch } from 'react-router-dom';

export default function Lotes(){
    let { url } = useRouteMatch();
    return(
        <Card className="shadow btcl-green btw-2">            
            <Card.Body>
                <Card.Title><BsBuilding /> Lotes</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/lote/condominal`} className="btn btn-outline-secondary btn-sm">Condominios</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/lote/habitacional`} className="btn btn-outline-secondary btn-sm">Habitacional</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/lote/comercial`} className="btn btn-outline-secondary btn-sm">Comercial</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
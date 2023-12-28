import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { FaUserShield } from 'react-icons/fa';

export default function DatosFiscalesComp(){
    let { url } = useRouteMatch();
    return(
        <Card className="shadow btcl-green btw-2">            
            <Card.Body>
                <Card.Title><FaUserShield  className="mb-1" /> Datos Fiscales</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                <li className="list-inline-item"><Link to={`${url}/datos-fiscales/value`} className="btn btn-outline-secondary btn-sm">Crear datos fiscales</Link></li>
                <li className="list-inline-item"><Link to={`${url}/datos-fiscales`} className="btn btn-outline-secondary btn-sm">Ver datos fiscales</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}

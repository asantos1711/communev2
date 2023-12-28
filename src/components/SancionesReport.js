import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom';
import { RiAlarmWarningLine } from 'react-icons/ri';

export default function SancionesReport(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-cyan btw-2">         
            <Card.Body>
                <Card.Title><RiAlarmWarningLine className="mb-2"/> Sanciones</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/sanciones-reportes`} className="btn btn-outline-secondary btn-sm">Tipo de sanción</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
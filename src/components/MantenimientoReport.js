import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import { DiGoogleAnalytics } from "react-icons/di";

export default function MantenimientoReport(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-cyan btw-2">         
            <Card.Body>
                <Card.Title><DiGoogleAnalytics className="mb-2"/> Mantenimiento</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/mantenimiento-vencido`} className="btn btn-outline-secondary btn-sm">Mantenimiento vencido</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/mantenimiento-vencido-conciliacion`} className="btn btn-outline-secondary btn-sm">Conciliación</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
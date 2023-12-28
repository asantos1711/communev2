import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { AiOutlineAppstore } from 'react-icons/ai';
import { Link, useRouteMatch } from "react-router-dom";

export default function AccesoComponent(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><AiOutlineAppstore className="mb-1" /> Accesos</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/accesos`} className="btn btn-outline-secondary btn-sm mb-2">Accesos</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/accesos/estadisticas`} className="btn btn-outline-secondary btn-sm mb-2">Estadísticas</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/rondines`} className="btn btn-outline-secondary btn-sm mb-2">Rondines</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
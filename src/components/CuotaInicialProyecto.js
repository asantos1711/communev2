import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import { AiFillBuild } from "react-icons/ai";

function CuotaInicialProyecto(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><AiFillBuild className="mb-1" /> Cuota revisión de proyecto</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/cuota-inicial-proyecto`} className="btn btn-outline-secondary btn-sm mb-2">Ver todos</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/cuota-inicial-proyecto/value`} className="btn btn-outline-secondary btn-sm mb-2">Crear</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}

export default CuotaInicialProyecto
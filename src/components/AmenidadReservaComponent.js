import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import { AiOutlineAppstore } from "react-icons/ai";

function AmenidadReservaComponent(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><AiOutlineAppstore className="mb-1" /> Amenidades</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/amenidades`} className="btn btn-outline-secondary btn-sm mb-2">Tipos de amenidades</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/reglas-amenidades`} className="btn btn-outline-secondary btn-sm mb-2">Reglas</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/crear-agenda`} className="btn btn-outline-secondary btn-sm mb-2">Crear agenda</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/ver-agenda`} className="btn btn-outline-secondary btn-sm mb-2">Ver agenda</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/crear-reserva`} className="btn btn-outline-secondary btn-sm mb-2">Crear reserva</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/amenidad/ver-reserva`} className="btn btn-outline-secondary btn-sm mb-2">Ver reserva</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}

export default AmenidadReservaComponent
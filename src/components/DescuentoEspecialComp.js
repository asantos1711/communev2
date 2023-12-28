import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { FaPercent } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function DescuentoEspecialComp(){
    let { url } = useRouteMatch()

    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><FaPercent className="mb-1"/> Descuento especial</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/descuento-especial`} className="btn btn-outline-secondary btn-sm">Ver descuentos especiales</Link></li>                 
                </ul>                
            </Card.Body>
        </Card>
    )
}
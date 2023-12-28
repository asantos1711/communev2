import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { DiStreamline } from 'react-icons/di';
import { Link, useRouteMatch } from 'react-router-dom';

function OtrasCuotasComp(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><DiStreamline /> Otras cuotas</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/tipo-cuota`} className="btn btn-outline-secondary btn-sm">Tipos</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}

export default OtrasCuotasComp
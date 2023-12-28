import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function Bitacora(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><FaFileAlt className="mb-1" /> Bitácora</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/bitacora`} className="btn btn-outline-secondary btn-sm mb-2">Ver bitácora</Link></li>                    
                </ul>                
            </Card.Body>
        </Card>
    )
}

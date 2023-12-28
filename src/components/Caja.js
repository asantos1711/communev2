import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import {  FaCashRegister } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function Caja(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-cyan btw-2">         
            <Card.Body>
                <Card.Title><FaCashRegister className="mb-2"/> Caja</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/corte-caja`} className="btn btn-outline-secondary btn-sm">Corte de caja</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
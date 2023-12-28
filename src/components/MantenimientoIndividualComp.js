import React from 'react';
import { Card, Dropdown } from "react-bootstrap";
import { MdDomain } from 'react-icons/md';
import { useRouteMatch } from "react-router-dom";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function MantenimientoIndividualComp(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-warning btw-2">         
            <Card.Body>
                <Card.Title><MdDomain /> Mantenimiento</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">                                       
                    <li className="list-inline-item">
                        <Link to={`${url}/generarperiodo`} className="btn btn-outline-secondary btn-sm">Generar Período</Link>
                    </li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )

}
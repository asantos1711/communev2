import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function FacturaReport(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-cyan btw-2">         
            <Card.Body>
                <Card.Title><FaFileInvoiceDollar  className="mb-1" /> Factura</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/factura-canceladas`} className="btn btn-outline-secondary btn-sm">Facturas canceladas</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )   
}
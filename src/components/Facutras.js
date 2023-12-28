import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { isTags } from '../security/isTags';

export default function Facutras({auth}){
    let { url } = useRouteMatch();
    return(
        <Card className="shadow btcl-dark btw-2">            
            <Card.Body>
                <Card.Title><FaFileInvoiceDollar  className="mb-1" /> Facturas</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/facturas`} className="btn btn-outline-secondary btn-sm">Facturas</Link></li>
                    {!isTags(auth.data.role) && <li className="list-inline-item"><Link to={`${url}/generarfactura`} className="btn btn-outline-secondary btn-sm">Generar Factura</Link></li>}
                </ul>                
            </Card.Body>
        </Card>
    )
}


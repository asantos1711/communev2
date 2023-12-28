import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function PagosAtrasadosReport(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-cyan btw-2">         
            <Card.Body>
                <Card.Title><FaFileInvoiceDollar  className="mb-2" /> Pagos atrasados</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/pagos-atrasados`} className="btn btn-outline-secondary btn-sm">Pagos atrasados</Link></li>
                    <li className='list-inline-item'><Link to={`${url}/cartera-vencida`} className="btn btn-outline-secondary btn-sm">Descargar cartera vencida</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )   
}
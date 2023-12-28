import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { FaDollarSign } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';

export default function Security(){
    let { url } = useRouteMatch();

    return(        
        <Card className="shadow btcl-dark btw-2">         
            <Card.Body>
                <Card.Title><FaDollarSign /> Pagos</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    {/* <li className="list-inline-item"><Link to={`${url}`} className="btn btn-outline-secondary btn-sm">Cancelar pagos</Link></li>  
                    <li className="list-inline-item"><Link to={`${url}`} className="btn btn-outline-secondary btn-sm">Editar pagos</Link></li> */}
                    <li className="list-inline-item"><Link to={`${url}/importar-pagos`} className="btn btn-outline-secondary btn-sm">Importar pagos mttos</Link></li>
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
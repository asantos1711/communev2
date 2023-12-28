import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { MdPayment } from 'react-icons/md'

export default function PagosComp(){
    let { url } = useRouteMatch()

    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><MdPayment className="mb-1"/> Pagos</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/metodo-pago`} className="btn btn-outline-secondary btn-sm">Método pago</Link></li>   
                    <li className="list-inline-item"><Link to={`${url}/banco`} className="btn btn-outline-secondary btn-sm">Bancos</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/caja`} className="btn btn-outline-secondary btn-sm">Tipo caja</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
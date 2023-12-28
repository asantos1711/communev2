import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { useRouteMatch, Link } from 'react-router-dom'
import { GrMoney } from 'react-icons/gr';

export default function ReglasDescuentos(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><GrMoney /> Descuentos</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/reglas`} className="btn btn-outline-secondary btn-sm">Reglas</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
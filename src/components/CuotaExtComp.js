import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import { FaRegCalendarCheck } from 'react-icons/fa'

export default function CuotaExtComp(){
    const { url } = useRouteMatch()
    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><FaRegCalendarCheck className="mb-1" /> Cuota extraordinaria</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/cuota-extraordinaria`} className="btn btn-outline-secondary btn-sm mb-2">Ver cuotas extraordinarias</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/cuota-extraordinaria/value`} className="btn btn-outline-secondary btn-sm mb-2">Crear cuota extraordinaria</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/cuota-extraordinaria-generadas`} className="btn btn-outline-secondary btn-sm">Cuotas extraordinarias generadas</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
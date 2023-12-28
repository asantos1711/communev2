import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { FaCalendarDay } from 'react-icons/fa'

export default function CuotaInicialComp(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><FaCalendarDay className="mb-1" /> Cuota equipamiento inicial</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/cuota-inicial`} className="btn btn-outline-secondary btn-sm mb-2">Ver cuotas inicales</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/cuota-inicial/value`} className="btn btn-outline-secondary btn-sm mb-2">Crear cuota inicial</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/cuota-inicial-generadas`} className="btn btn-outline-secondary btn-sm">Cuotas inicial generadas</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
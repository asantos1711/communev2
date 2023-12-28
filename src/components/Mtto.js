import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { GrVmMaintenance } from "react-icons/gr";

export default function Mtto(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><GrVmMaintenance /> Mantenimiento</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/mantenimiento`} className="btn btn-outline-secondary btn-sm">Ordinario</Link></li>                    
                    <li className="list-inline-item"><Link to={`${url}/mantenimientos-generados`} className="btn btn-outline-secondary btn-sm">Mantenimientos generados</Link></li>
                    <li className="list-inline-item"><Link to={`${url}/tiie`} className="btn btn-outline-secondary btn-sm">TIIE</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
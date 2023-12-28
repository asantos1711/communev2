import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { MdCancel } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"

export default function CancelarDeudasComp(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><MdCancel /> Cancelar deuda</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/cancelardeuda`} className="btn btn-outline-secondary btn-sm">Cancelar deuda</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
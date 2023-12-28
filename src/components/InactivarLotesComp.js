import React from 'react'
import { Card, Dropdown } from "react-bootstrap"
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible } from 'react-icons/ai';

export default function InactivarLotesComp(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><AiFillEyeInvisible /> Inactivar/Activar lote</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/inactivarlote`} className="btn btn-outline-secondary btn-sm">Inactivar/Activar lote</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
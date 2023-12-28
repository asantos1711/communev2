import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Card, Dropdown } from 'react-bootstrap'
import { BsGraphUp } from 'react-icons/bs'

export default function InteresesMoratoriosComp(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><BsGraphUp className="mb-1" /> Intereses moratorios</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/intereses-moratorios`} className="btn btn-outline-secondary btn-sm mb-2">Ver intereses moratorios</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
import React from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { GiJoin } from "react-icons/gi";
import { Link, useRouteMatch } from "react-router-dom"

export default function FusionLotesComp(){
    let { url } = useRouteMatch()
    return(
        <Card className="shadow btcl-primary btw-2">            
            <Card.Body>
                <Card.Title><GiJoin /> Fusionar lotes</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/fusionarlotes`} className="btn btn-outline-secondary btn-sm">Fusionar lotes</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}
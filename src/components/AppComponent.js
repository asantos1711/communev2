import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import { AiOutlineAppstore } from "react-icons/ai";

function AppComponent(){
    const { url } = useRouteMatch()

    return (
        <Card className="shadow btcl-danger btw-2">            
            <Card.Body>
                <Card.Title><AiOutlineAppstore className="mb-1" /> App</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/usuarios-app`} className="btn btn-outline-secondary btn-sm mb-2">Ver usuarios</Link></li>
                </ul>                
            </Card.Body>
        </Card>
    )
}

export default AppComponent
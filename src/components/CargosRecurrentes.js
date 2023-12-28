import React, { useContext } from 'react'
import { useRouteMatch, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { Card, Dropdown } from 'react-bootstrap';
import { FaCreditCard } from 'react-icons/fa';

export default function CargosRecurrentes(){
    let { url } = useRouteMatch();
    const {auth} = useContext(authContext)

    return(        
        <Card className="shadow btcl-dark btw-2">         
            <Card.Body>
                <Card.Title><FaCreditCard className="mb-1"/> Cargos Recurrentes</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/cargos-recurrentes`} className="btn btn-outline-secondary btn-sm">Cargos recurrentes</Link></li>                      
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
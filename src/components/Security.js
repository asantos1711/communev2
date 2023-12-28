import React, { useContext } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { FaShieldAlt } from 'react-icons/fa';
import { Link, useRouteMatch } from 'react-router-dom';
import {IsSuperadmin} from '../security/IsSuperadmin';
import { authContext } from '../context/AuthContext';

export default function Security(){
    let { url } = useRouteMatch();
    const {auth} = useContext(authContext)

    return(        
        <Card className="shadow btcl-danger btw-2">         
            <Card.Body>
                <Card.Title><FaShieldAlt /> Seguridad</Card.Title>
                <Dropdown.Divider />
                <ul className="list-inline mt-3">
                    <li className="list-inline-item"><Link to={`${url}/usuario`} className="btn btn-outline-secondary btn-sm">Usuarios</Link></li>
                    {/* {IsSuperadmin(auth.data.role) && <li className="list-inline-item"><Link to={`${url}/role`} className="btn btn-outline-secondary btn-sm">Role</Link></li>} */}
                </ul>                                   
            </Card.Body>            
        </Card>
    )
}
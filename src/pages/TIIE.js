import React, { useContext, useState } from 'react'
import { fn } from 'moment'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { Card, Dropdown } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { BsPlusCircleFill } from 'react-icons/bs';
import TIIEList from './TIIEList';
import TIIEValue from './TIIEValue';

export default function TIIE(){
    let {path, url} = useRouteMatch();
    const { auth } = useContext(authContext)
    const [isEditing, setIsEditing] = useState(false)

    const handleIsEditing = valor =>{
        setIsEditing(valor)
    }

    return(
        <Card className="shadow">
            <ToastContainer />
            <Card.Body>
                <Switch>
                <Route path={path} exact>
                    <Card.Title>TIIE {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nueva</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <TIIEList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} TIIE`}</Card.Title>
                    <Dropdown.Divider /> 
                    <TIIEValue auth={auth} isEditing={isEditing} />
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )

}
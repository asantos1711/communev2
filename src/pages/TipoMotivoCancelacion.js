import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import TipoMotivoCancelacionList from './TipoMotivoCancelacionList';
import TipoMotivoCancelacionValue from './TipoMotivoCancelacionValue';

export default function TipoMotivoCancelacion(){
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
                    <Card.Title>Motivo de cancelación {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <TipoMotivoCancelacionList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} motivo de cancelación`}</Card.Title>
                    <Dropdown.Divider /> 
                     <TipoMotivoCancelacionValue auth={auth} isEditing={isEditing}/>
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}
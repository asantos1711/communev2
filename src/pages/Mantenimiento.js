import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link, useParams } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { Card, Dropdown } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { BsPlusCircleFill } from 'react-icons/bs';
import MantenimientoList from './MantenimientoList';
import MantenimientoValue from './MantenimientoValue';

export default function Mantenimiento(){
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
                    <Card.Title>Mantenimiento {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <MantenimientoList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} mantenimiento`}</Card.Title>
                    <Dropdown.Divider /> 
                    <MantenimientoValue auth={auth} isEditing={isEditing} />
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}
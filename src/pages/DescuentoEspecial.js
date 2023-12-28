import React, { useContext, useState } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { authContext } from '../context/AuthContext';
import DescuentoEspecialList from './DescuentoEspecialList';
import DescuentoEspecialValue from './DescuentoEspecialValue';

export default function DescuentoEspecial(){
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
                    <Card.Title>Descuento especial {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <DescuentoEspecialList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} banco`}</Card.Title>
                    <Dropdown.Divider /> 
                     <DescuentoEspecialValue auth={auth} isEditing={isEditing}/>
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}
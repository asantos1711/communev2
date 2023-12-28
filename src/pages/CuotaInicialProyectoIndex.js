import React, { useContext, useState } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { authContext } from '../context/AuthContext';
import CuotaInicialProyectoList from './CuotaInicialProyectoList';
import CuotaInicialProyectoValue from './CuotaInicialProyectoValue';

function CuotaInicialProyectoIndex(){
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
                    <Card.Title>Cuota revisión de proyecto{' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nueva</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <CuotaInicialProyectoList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nueva'} cuota revisión de proyecto`}</Card.Title>
                    <Dropdown.Divider /> 
                    <CuotaInicialProyectoValue auth={auth} isEditing={isEditing} />
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}

export default CuotaInicialProyectoIndex
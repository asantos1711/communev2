import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import TipoRelacionFacturaList from './TipoRelacionFacturaList';
import TipoRelacionFacturaValue from './TipoRelacionFacturaValue';

export default function TipoRelacionFactura(){
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
                    <Card.Title>Tipo relación de factura {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                    <Dropdown.Divider />
                    <TipoRelacionFacturaList path={path} auth={auth} handleIsEditing={handleIsEditing} />   
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} tipo relación de factura`}</Card.Title>
                    <Dropdown.Divider /> 
                     <TipoRelacionFacturaValue auth={auth} isEditing={isEditing}/>
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}
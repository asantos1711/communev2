import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import CodigoAutorizacionList from './CodigoAutorizacionList';
import CodigoAutorizacionValue from './CodigoAutorizacionValue';

export default function CodigoAutorizacion(){
    let {path, url} = useRouteMatch();
    const { auth } = useContext(authContext)
    const [isEditing, setIsEditing] = useState(false)
    const handleIsEditing = valor =>{
        setIsEditing(valor)
    }

    return(
        <div>
            <ToastContainer />
            <Switch>            
                <Route path={path} exact>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`Código de autorización`}  {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                            <Dropdown.Divider />  
                            <CodigoAutorizacionList path={path} auth={auth} handleIsEditing={handleIsEditing}/> 
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} código de autorización`}</Card.Title>
                            <Dropdown.Divider />  
                            <CodigoAutorizacionValue auth={auth}/>                         
                        </Card.Body>
                    </Card>
                    
                </Route>
            </Switch>
        </div>
    )
}
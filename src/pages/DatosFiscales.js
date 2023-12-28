import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import DatosFiscalesList from './DatosFiscalesList';
import DatosFiscalesValue from './DatosFiscalesValue';

export default function DatosFiscales(){
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
                            <Card.Title>{`Datos fiscales`}  {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                            <Dropdown.Divider />  
                            <DatosFiscalesList path={path} auth={auth} handleIsEditing={handleIsEditing}/> 
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <DatosFiscalesValue auth={auth} isEditing={isEditing}/>                        
                </Route>
            </Switch>
        </div>
    )
}

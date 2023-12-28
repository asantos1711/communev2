import React, { useContext, useState } from 'react';
import { Button, Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { authContext } from '../context/AuthContext';
import TipoCuotaList from './TipoCuotaList';
import TipoCuotaValue from './TipoCuotaValue';

export default function TipoCuota(){
    let {path, url} = useRouteMatch();
    const { auth } = useContext(authContext)
    const [isEditing, setIsEditing] = useState(false)
    let history = useHistory()

    const handleIsEditing = valor =>{
        setIsEditing(valor)
    }

    const handleNew = ()=>{
        setIsEditing(false)
        history.push(`${url}/value`)
    }

    return(
        <div>
            <ToastContainer />
            <Switch>            
                <Route path={path} exact>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`Tipos de cuota`}  {' '}
                                <Button size="sm" variant="outline-primary" onClick={handleNew}> <BsPlusCircleFill className="mt-m5" /> Nuevo</Button>
                            </Card.Title>
                            <Dropdown.Divider />  
                            <TipoCuotaList url={url} auth={auth} handleIsEditing={handleIsEditing}/>
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} tipo de cuota`}</Card.Title>
                            <Dropdown.Divider /> 
                            <TipoCuotaValue auth={auth} url={url} isEditing={isEditing} />   
                        </Card.Body>
                    </Card>
                                            
                </Route>
            </Switch>
        </div>        
    )

}
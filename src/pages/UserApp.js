import React, { useState, useContext } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import UserAppList from './UserAppList'
import UserAppValue from './UserAppValue'

export default function UserApp(){
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
                        <Card.Title>Usuarios de la App {' '}</Card.Title>
                        <Dropdown.Divider />  
                        <UserAppList path={path} auth={auth} handleIsEditing={handleIsEditing}/> 
                    </Route>                
                    <Route exact path={`${path}/value`}>
                        <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} usuario de la app`}</Card.Title>
                        <Dropdown.Divider /> 
                        <UserAppValue auth={auth} />
                    </Route>
                </Switch>          
            </Card.Body>                
        </Card>
    )
}
import React, { useState, useContext } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom'
import UserValue from './UserValue'
import { ToastContainer } from 'react-toastify'
import UserList from './UserList'

export default function User(){
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
                        <Card.Title>Usuarios {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                        <Dropdown.Divider />  
                        <UserList path={path} auth={auth} handleIsEditing={handleIsEditing}/> 
                    </Route>                
                    <Route exact path={`${path}/value`}>
                        <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} usuario`}</Card.Title>
                        <Dropdown.Divider /> 
                        <UserValue auth={auth} />
                    </Route>
                </Switch>          
            </Card.Body>                
        </Card>
    )
}
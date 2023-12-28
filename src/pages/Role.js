import React, { useState, useContext } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import RoleList from './RoleList'
import RoleValue from './RoleValue'

export default function Role(){
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
                    <Card.Title>Roles {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                    <Dropdown.Divider />  
                    <RoleList path={path} auth={auth} handleIsEditing={handleIsEditing}/> 
                </Route>                
                <Route exact path={`${path}/value`}>
                    <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} rol`}</Card.Title>
                    <Dropdown.Divider /> 
                    <RoleValue auth={auth} isEditing={isEditing}/>
                </Route>
            </Switch>          
            </Card.Body>                
        </Card>
    )
}
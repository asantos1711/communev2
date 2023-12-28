import React from 'react';
import { useContext, useState } from "react";
import { Card, Dropdown } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Link, Route, useRouteMatch } from "react-router-dom";
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { ToastContainer } from 'react-toastify';
import { authContext } from "../../context/AuthContext";
import PlantillaList from './PlantillaList';

export default function PlantillasIndex(){
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
                        <Card.Title>Plantillas {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                        <Dropdown.Divider /> 
                        <PlantillaList path={path} auth={auth} handleIsEditing={handleIsEditing}/>
                    </Route>                
                    <Route exact path={`${path}/value`}>
                        <Card.Title>{`${isEditing ? 'Editar': 'Nueva'} plantilla`}</Card.Title>
                        <Dropdown.Divider /> 
                        {/* <NewsLetterValue auth={auth} /> */}
                    </Route>
                </Switch>          
            </Card.Body>                
        </Card>
    )
}
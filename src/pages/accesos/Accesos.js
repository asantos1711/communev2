import React, { useContext }  from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Route, useRouteMatch } from "react-router-dom";
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { ToastContainer } from 'react-toastify';
import { authContext } from "../../context/AuthContext";
import AccesosList from './AccesosList';

export default function Accesos(){
    let {path} = useRouteMatch();
    const { auth } = useContext(authContext)

    return(
        <Card className="shadow">
            <ToastContainer />
            <Card.Body>
                <Switch>
                    <Route path={path} exact>
                        <Card.Title>Accesos</Card.Title>
                        <Dropdown.Divider /> 
                        <AccesosList path={path} auth={auth}/>
                    </Route>
                </Switch>          
            </Card.Body>                
        </Card>
    )
}
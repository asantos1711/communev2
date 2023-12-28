import React, { useContext } from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Card, Dropdown } from 'react-bootstrap';
import FacturasList from './FacturasList';

export default function FacturasIndex(){
    let {path, url} = useRouteMatch();
    const { auth } = useContext(authContext)

    return(
        <div>
            <ToastContainer />
            <Switch>            
                <Route path={path} exact>
                    <Card className="shadow">
                        <Card.Body>
                             <Card.Title>{`Facturas`}  </Card.Title>
                            <Dropdown.Divider />  
                            <FacturasList path={path} auth={auth}/> 
                        </Card.Body>
                    </Card>                 
                </Route>  
            </Switch>
        </div>
    )
}
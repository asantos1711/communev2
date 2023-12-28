import React, { useContext, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";
import { authContext } from "../context/AuthContext";
import RepresentanteLegalList from "./RepresentanteLegalList";
import RepresentanteLegalValue from "./RepresentanteLegalValue";

export default function RepresentanteLegal(){
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
                            <Card.Title>{`Representante Legal`}  {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                            <Dropdown.Divider />  
                            <RepresentanteLegalList path={path} url={url} auth={auth} handleIsEditing={handleIsEditing}/> 
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <RepresentanteLegalValue auth={auth} isEditing={isEditing}/>
                </Route>
            </Switch>
        </div>
    )
}
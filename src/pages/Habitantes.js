import React, { useContext, useState } from 'react'
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { Card, Dropdown } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { BsPlusCircleFill } from 'react-icons/bs';
import HabitantesList from './HabitantesList';
import HabitantesValue from './HabitantesValue';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

export default function Habitantes(){
    let {path, url} = useRouteMatch();
    const {tipo} = useParams()
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
                            <Card.Title>{tipo}  {' '}<small><Link to={`${url}/value`} className="btn btn-outline-primary btn-sm"><BsPlusCircleFill className="mt-m5" /> Nuevo</Link></small></Card.Title>
                            <Dropdown.Divider />  
                            <HabitantesList path={path} url={url} auth={auth} handleIsEditing={handleIsEditing} tipo={tipo}/> 
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <HabitantesValue auth={auth} isEditing={isEditing} tipoHabitante={tipo}/>                        
                </Route>
            </Switch>
        </div>
    )

}
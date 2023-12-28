import React, { useContext, useState } from 'react'
import { Card, Dropdown, Button } from 'react-bootstrap';
import { useParams, useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import LoteTypesList from './LoteTypesList';
import LoteTypesValue from './LoteTypesValue';
import { BsPlusCircleFill } from 'react-icons/bs';

export default function LoteTypes(){
    let { type_lote } = useParams();
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
                            <Card.Title>{`Lote ${type_lote}`}  {' '}
                                <Button size="sm" variant="outline-primary" onClick={handleNew}> <BsPlusCircleFill className="mt-m5" /> Nuevo</Button>
                            </Card.Title>
                            <Dropdown.Divider />  
                            <LoteTypesList url={url} auth={auth} handleIsEditing={handleIsEditing}  type_lote={type_lote}/>
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <LoteTypesValue auth={auth} isEditing={isEditing} type_lote={type_lote}/>                           
                </Route>
            </Switch>
        </div>        
    )

}
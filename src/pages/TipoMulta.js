import React, { useState, useContext } from 'react'
import { useHistory, useRouteMatch, Switch, Route } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import { ToastContainer } from 'react-toastify'
import { Card, Button, Dropdown } from 'react-bootstrap'
import { BsPlusCircleFill } from 'react-icons/bs'
import TipoMultaList from './TipoMultaList'
import TipoMultaValue from './TipoMultaValue'

export default function TipoMulta(){
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
                            <Card.Title>{`Tipos de sanción`}  {' '}
                                <Button size="sm" variant="outline-primary" onClick={handleNew}> <BsPlusCircleFill className="mt-m5" /> Nuevo</Button>
                            </Card.Title>
                            <Dropdown.Divider />  
                            <TipoMultaList url={url} auth={auth} handleIsEditing={handleIsEditing}/>
                        </Card.Body>
                    </Card>                 
                </Route>  
                <Route exact path={`${path}/value`}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{`${isEditing ? 'Editar': 'Nuevo'} tipo de sanción`}</Card.Title>
                            <Dropdown.Divider /> 
                            <TipoMultaValue auth={auth} url={url} isEditing={isEditing} />   
                        </Card.Body>
                    </Card>
                                            
                </Route>
            </Switch>
        </div>        
    )
}
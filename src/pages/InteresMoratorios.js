import React, { useContext, useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { Card, Dropdown, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import InteresesMoratoriosList from './InteresesMoratoriosList';
import { loaderRequest } from '../loaders/LoaderRequest';
import { LOTE_GENERAR_INTERESES_MRATORIOS,INTERESES_MORATORIOS_BTACORA_LAST } from '../service/Routes';
import Post from '../service/Post';
import Get from '../service/Get';
import moment from 'moment'

export default function InteresMoratorios(){
    const { auth } = useContext(authContext) 
    const [isSubmiting, setSubmiting] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [bit, setBit] = useState(null)

    useEffect(()=>{
        Get({url: INTERESES_MORATORIOS_BTACORA_LAST, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setBit(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
            setLoading(false)
        })
    },[])

    const onClickGenerar = e =>{
        //console.log('generar intereses moratorios')
        setSubmiting(true)
        Post({url: LOTE_GENERAR_INTERESES_MRATORIOS, data: {}, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setSubmiting(false)
            toast.success("Intereses moratorios generados exitosamente", {autoClose: 3000})
        })
        .catch(error=>{
            //console.log(error)
            setSubmiting(false)
            toast.error("Ocurrió un error. Contacte con el administrador", {autoClose: 8000})
        })
    }

    return(
        <Card className="shadow">
            {isSubmiting && loaderRequest()}
            <ToastContainer />
            <Card.Body>
                <Card.Title>
                    <div className="d-flex justify-content-between">
                        <div>Intereses moratorios</div>
                        <div>
                            <Button variant="outline-primary" size="sm" block onClick={e=>onClickGenerar()}>Generar </Button>
                            <small className="text-muted ft-11">{ bit!==null && `Última actualización: ${moment(bit.createdAt).format('DD-MM-YYYY HH:mm')}`}</small>
                        </div>
                    </div>
                </Card.Title>
                    
                    
                <Dropdown.Divider /> 
                <InteresesMoratoriosList auth={auth} />      
            </Card.Body>                
        </Card>
    )
}
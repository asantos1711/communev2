import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { toast, ToastContainer } from 'react-toastify';
import CrearAgendaForm from '../../../components/agenda/CrearAgendaForm';
import { authContext } from '../../../context/AuthContext';
import Get from '../../../service/Get';
import { GET_AGENDA } from '../../../service/Routes';

export default function EditarAgenda(){
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(authContext)
    const [agenda, setAgenda] = useState(null)

    useEffect(() => {
        Get({url: `${GET_AGENDA}/${id}`, access_token: auth.data.access_token })
        .then(response => {
            //console.log(response)
            setAgenda(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
        })
    }, [])



    return(
        loading ? <Skeleton  height={45}/> :
        <Row className='mb-3'>
            <ToastContainer />
            <Col xs="12" lg="12">
                <Card className="shadow">
                    <Card.Body>
                        <CrearAgendaForm agenda={agenda} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}
import React, { useContext, useEffect, useState } from 'react';
import { NOTAALERTA_GET_BY_LOTE } from '../service/Routes'
import { Card, Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { authContext } from '../context/AuthContext';
import Get from '../service/Get';
import NotaList from '../components/NotaList';
import { Row, Col } from 'react-bootstrap';
import TableSkeleton from '../loaders/TableSkeleton'
import NotaForm from '../components/NotaForm';
import moment from 'moment'

export default function Nota(){
    const {id} = useParams()
    const { auth } = useContext(authContext)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [initialValues, setInitialValues] = useState({
        id: '',
        tipo: 'nota',
        lote: {id: id},
        activa: true,
        descripcion: '',
        fechaRecordatorio: ''
    })

    useEffect(()=>{
        Get({url: `${NOTAALERTA_GET_BY_LOTE}/nota/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            setItems(response.data)
            setLoading(false)
        })
        .catch(error=>{
            toast.error("Lo sentimos no se puede obtener la información. Contacte al administrador", {autoClose: 8000})
            setLoading(false)
        })
    },[])

    const editItem = row =>{
        setInitialValues(prev=>({
            ...prev,
            id: row.id,
            descripcion: row.descripcion,
            fechaRecordatorio: new Date(moment(row.fechaRecordatorio, "YYYY-MM-DD"))
        }))
    }

    return(
        <>
            <ToastContainer />
            <Card className="shadow mb-3">
                <Card.Body>
                    <Card.Title>Nueva nota</Card.Title>
                    <Dropdown.Divider />
                    <NotaForm 
                        auth={auth} id={id} items={items} 
                        setItems={setItems} 
                        initialValues={initialValues}
                        setInitialValues={setInitialValues}
                    />
                </Card.Body>
            </Card>
            <Card className="shadow mb-3">
                <Card.Body>
                    <Card.Title>Lista de notas</Card.Title>
                    <Dropdown.Divider />
                    {loading ? <Row><Col><TableSkeleton /></Col></Row> : <NotaList items={items} editItem={editItem} auth={auth}/>}
                </Card.Body>
            </Card>
        </>
    )

}
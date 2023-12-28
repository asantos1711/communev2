import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext'
import * as Yup from 'yup';
import Get from '../service/Get';
import { CONTROL_FACTURA_GET_BY_DEFAULT, CONTROL_FACTURA_SAVE } from '../service/Routes';
import { Button, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Field, Formik } from 'formik';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';

export default function ControlFactura(){
    const {auth} = useContext(authContext)
    const[isLoadEntity, setLoadEntity] = useState(true)

    const [initialValues, setInitialValues] = useState({
        id: '', 
        email: '',
        emailSecondary: ''
    })

    useEffect(()=>{
        setLoadEntity(true)
            Get({url: `${CONTROL_FACTURA_GET_BY_DEFAULT}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                if(response.data.data.id!=null){
                    let entity ={
                        id: response.data.data.id,
                        email: response.data.data.email,
                        emailSecondary: response.data.data.emailSecondary,                        
                    }                
                    setInitialValues(entity)
                }                
                setLoadEntity(false)
            })
            .catch(error=>{
                //console.log(error)
            })
    },[])

    const shemaValidate = Yup.object().shape({
        email: Yup.string()
            .required('Campo Requerido')
    });

    return(
        <Card>
            <ToastContainer />
            <Card.Body>
                <Card.Title>Control de factura</Card.Title>
                <Dropdown.Divider />
                <Row>
                    <Col>
                    {
                        isLoadEntity
                        ? <Skeleton height={300}/>
                        : <Formik
                            initialValues={initialValues}
                            validationSchema={shemaValidate}
                            onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => {   
                                Post({url: CONTROL_FACTURA_SAVE, data: values, access_token: auth.data.access_token, header: true})
                                .then(response=>{
                                    //console.log(response)
                                    toast.success("Acción exitosa", {autoClose: 3000})
                                    setFieldValue('id', response.data.data.id)   
                                    setSubmitting(false)                                 
                                })
                                .catch(error=>{
                                    toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador", {autoClose: 8000})
                                    setSubmitting(false)
                                })                                                    
                            }}
                        >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue
                        }) => (
                            <Form onSubmit={handleSubmit}>
                                {isSubmitting && loaderRequest()}
                                <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                                <Row className="mb-3">
                                    <Col xs="4" md="4">
                                        <Form.Group>
                                            <Form.Label>Correo electrónico<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.email && 'error'} form-control`}
                                                type="email"
                                                name="email"
                                            />
                                            {errors.email && <Form.Control.Feedback type="invalid" >{errors.email}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="4" md="4">
                                        <Form.Group>
                                            <Form.Label>Correo electrónico secundario</Form.Label>
                                            <Field 
                                                className={`${errors.emailSecondary && 'error'} form-control`}
                                                type="email"
                                                name="emailSecondary"
                                            />                                            
                                        </Form.Group>
                                    </Col>
                                </Row>                                
                                <Row>
                                    <Col>
                                        <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                        <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                        </Formik>
                    }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}
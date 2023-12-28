import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import { REGLAS_GET_BY_ID, REGLAS_SAVE } from '../service/Routes';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { Link, useHistory } from 'react-router-dom';

export default function ReglasValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        description: '',
        percentDiscount: '',
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${REGLAS_GET_BY_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name, 
                    description: response.data.data.description,
                    percentDiscount: response.data.data.percentDiscount,                  
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,props.auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Muy corto')
            .required('Campo Requerido'),
        percentDiscount: Yup.number()
            .positive("No puede poner una cuota negativa")  
            .min(1, 'El porciento mínimo no puede ser menor a 1')
            .max(100, 'El porciento máximo no puede ser mayor a 100')
            .required('Campo Requerido'),
    });

    return (
        <div>
            {
                isLoadEntity
                ? "loading"
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        
                        Post({url: REGLAS_SAVE, data: values,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            setFieldValue("id", response.data.data.id)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/reglas")
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            // console.log(error)
                            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
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
                    <Form className="mt-4 form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.name && 'error'}`}
                                        type="text"
                                        name="name" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name} 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>  
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>% Descuento <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.percentDiscount && 'error'}`}
                                        type="text"
                                        name="percentDiscount"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.percentDiscount} 
                                    />
                                    {errors.percentDiscount && <Form.Control.Feedback type="invalid" >{errors.percentDiscount}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                                      
                        </Row>    
                        <Row>
                            <Col xs lg="8">
                                <Form.Group>
                                    <Form.Label>Descripción </Form.Label>
                                    <Form.Control as="textarea" rows="3"
                                        name="description" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description} 
                                    />                         
                                </Form.Group>
                            </Col>         
                        </Row>                    
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/reglas" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}
import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom'
import Get from '../service/Get'
import { METODO_PAGO_CFI_GET_BY_ID, METODO_PAGO_CFI_SAVE } from '../service/Routes'
import * as Yup from 'yup';
import { Formik, Field } from 'formik'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'
import Skeleton from 'react-loading-skeleton'

export default function MetodoPagoCFDIValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        metodoPago: ''
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${METODO_PAGO_CFI_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,  
                    metodoPago: response.data.data.metodoPago,  
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])
    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .required('Campo Requerido'),
        metodoPago: Yup.string()
            .required('Campo Requerido'),
    });
    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton  height={45}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        values['metodoPago'] = values.metodoPago.toUpperCase()                     
                        Post({url: METODO_PAGO_CFI_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/metodo-pago-cfdi")
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            //console.log(error)
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
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Método pago <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.metodoPago && 'error'} upper-case`}
                                        name="metodoPago" 
                                        type="text"
                                    />
                                    {errors.metodoPago && <Form.Control.Feedback type="invalid" >{errors.metodoPago}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`form-control ${errors.name && 'error'}`}
                                        name="name" 
                                        type="text"
                                    />                                    
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                                        
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/metodo-pago-cfdi" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}
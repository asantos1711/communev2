import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom'
import Get from '../service/Get'
import { FORMA_PAGO_CFDI_GET_BY_ID, FORMA_PAGO_CFDI_SAVE } from '../service/Routes'
import * as Yup from 'yup';
import { Formik, Field } from 'formik'
import Skeleton from 'react-loading-skeleton'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'

export default function FormaPagoCFDIValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        formaPago: ''
    })
    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${FORMA_PAGO_CFDI_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,  
                    formaPago: response.data.data.formaPago,
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
        formaPago: Yup.string()
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
                        Post({url: FORMA_PAGO_CFDI_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/forma-pago-cfdi")
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
                                    <Form.Label>Forma de pago <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.formaPago && 'error'} form-control`}
                                        name="formaPago" 
                                        type="text"
                                    />
                                    {errors.formaPago && <Form.Control.Feedback type="invalid" >{errors.formaPago}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.name && 'error'} form-control`}
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
                                <Link to="/catalogos/forma-pago-cfdi" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}
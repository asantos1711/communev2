import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { CODIGO_AUTORIZACION_SAVE,CODIGO_AUTORIZACION_GET_BY_ID } from '../service/Routes';
import { toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import Skeleton from 'react-loading-skeleton';

export default function CodigoAutorizacionValue({auth}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const history = useHistory()
    const query = useQuery()
    let idEntity = query.get('id');
    const [initialValues, setInitialValues] = useState({
        id: '', 
        codigo: '',
        cantidad: ''
    })
    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${CODIGO_AUTORIZACION_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{  
                //console.log(response)      
                             
                let entity ={
                    id: response.data.data.id, 
                    codigo: response.data.data.codigo,
                    cantidad: response.data.data.cantidad
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity])

    const shemaValidate = Yup.object().shape({
        codigo: Yup.string()
          .required('Campo Requerido'),
        cantidad: Yup.number()
          .min(1, "La cantidad de usos mínimos es 1")
          .required('Campo Requerido'),
    });
    return(
        <div>
            {
                isLoadEntity
                ? <Skeleton height={400}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {  
                        Post({url: CODIGO_AUTORIZACION_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            //console.log(response)
                            if(response.data.success){
                                setSubmitting(false)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/codigo-autorizacion")
                            }else{
                                setSubmitting(false)
                                toast.info(response.data.message, {autoClose: 8000})
                            }
                            
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
                                    <Form.Label>Código <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.codigo && 'error'} form-control`}
                                        type="text"
                                        name="codigo"
                                    />
                                    {errors.codigo && <Form.Control.Feedback type="invalid" >{errors.codigo}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Usos <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.cantidad && 'error'} form-control`}
                                        type="number"
                                        name="cantidad"
                                    />
                                    {errors.cantidad && <Form.Control.Feedback type="invalid" >{errors.cantidad}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>                            
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/codigo-autorizacion" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}
                </Formik>
            }
        </div>
    )

}
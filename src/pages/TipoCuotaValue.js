import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import { TIPO_CUOTA_GET_BY_ID, TIPO_CUOTA_SAVE } from '../service/Routes';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function TipoCuotaValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        descripcion: '',
        monto: '',
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${TIPO_CUOTA_GET_BY_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name, 
                    descripcion: response.data.data.descripcion,
                    monto: response.data.data.monto,                
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
        monto: Yup.number()
            .positive("No puede poner un  monto negativa")  
            .min(1, 'El monto mínimo no puede ser menor a 1')
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
                        const d={
                            id: values.id,
                            name: values.name,
                            monto: values.monto,
                            descripcion: values.descripcion,                           
                        }
                        
                        Post({url: TIPO_CUOTA_SAVE, data: d,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(response.data.success){
                                setFieldValue("id", response.data.data.id)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push(`${props.url}`)
                            }else{
                                toast.warning(response.data.message,{ autoClose: 8000 })
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
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Monto <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.monto && 'error'}`}
                                        type="number"
                                        name="monto"
                                        min="1" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.monto} 
                                    />
                                    {errors.monto && <Form.Control.Feedback type="invalid" >{errors.monto}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                 
                        </Row>    
                        <Row>
                            <Col xs lg="8">
                                <Form.Group>
                                    <Form.Label>Descripción </Form.Label>
                                    <Form.Control as="textarea" rows="3"
                                        name="descripcion" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.descripcion} 
                                    />                         
                                </Form.Group>
                            </Col>         
                        </Row>                    
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/tipo-cuota" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}
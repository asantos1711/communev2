import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import useQuery from "../hook/useQuery"
import Get from "../service/Get"
import { TIPO_MOTIVO_CANCELACION_GET_BY_ID, TIPO_MOTIVO_CANCELACION_SAVE, TIPO_RELACION_FACTURA_GET_BY_ID, TIPO_RELACION_FACTURA_SAVE } from "../service/Routes"
import * as Yup from 'yup';
import { Formik } from "formik"
import Post from "../service/Post"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"
import { loaderRequest } from "../loaders/LoaderRequest"

export default function TipoRelacionFacturaValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()

    const [initialValues, setInitialValues] = useState({
        id: '', 
        clave: '',
        descripcion: '',
    });

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${TIPO_RELACION_FACTURA_GET_BY_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{
                let entity ={
                    id: response.data.data.id,
                    clave: response.data.data.clave, 
                    descripcion: response.data.data.descripcion,               
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
        clave: Yup.string().required('Campo Requerido'),
        descripcion: Yup.string().required('Campo Requerido'),
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
                            clave: values.clave,
                            descripcion: values.descripcion,                           
                        }
                        
                        Post({url: TIPO_RELACION_FACTURA_SAVE, data: d,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(response.data.success){
                                setFieldValue("id", response.data.data.id)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/catalogos/relacion-factura")
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
                                    <Form.Label>Clave <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.clave && 'error'}`}
                                        type="text"
                                        name="clave" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.clave} 
                                    />
                                    {errors.clave && <Form.Control.Feedback type="invalid" >{errors.clave}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                  
                        </Row>    
                        <Row>
                            <Col xs lg="8">
                                <Form.Group>
                                    <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="textarea" rows="3"
                                        className={`${errors.clave && 'error'}`}
                                        name="descripcion" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.descripcion} 
                                    />      
                                    {errors.descripcion && <Form.Control.Feedback type="invalid" >{errors.descripcion}</Form.Control.Feedback>}                   
                                </Form.Group>
                            </Col>         
                        </Row>                    
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/motivo-cancelacion" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}
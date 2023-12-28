import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Field, Formik } from 'formik';
import Post from '../service/Post';
import { CARGO_CUOTA_INICIAL_PROYECTO_SAVE, LOTE_FOR_VEHICLES } from '../service/Routes';
import { toast } from 'react-toastify';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import SelectAjax from '../components/SelectAjax';

export default function CuotaInicialProyectoValue({auth, isEditing}){
    const history = useHistory()
    const [lote, setLote] = useState(null)

    const [initialValues, setInitialValues] = useState({
        id: '', 
        monto: '',
        lote: ''
    })

    const shemaValidate = Yup.object().shape({
        monto: Yup.number()
            .min(1, "Campo debe ser mayor a cero")
            .required('Campo Requerido'),
        lote: Yup.string()
            .required("Campo requerido")
    });

    return(
        <div>
            <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => {   
                        console.log(values)
                        Post({url: CARGO_CUOTA_INICIAL_PROYECTO_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            if(response.data.success){
                                setSubmitting(false)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/admin/cuota-inicial-proyecto")
                            }else{
                                setSubmitting(false)
                                toast.info(response.data.message,{ autoClose: 10000 })
                            }
                            
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            //console.log(error)
                            toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador",{ autoClose: 3000 })
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
                            <Col xs="12" lg="8">
                                <Form.Group>
                                    <Form.Label>Lote<span className="text-danger">*</span></Form.Label>
                                    <SelectAjax
                                        defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                        url={LOTE_FOR_VEHICLES}
                                        access_token={auth.data.access_token}
                                        isMulti={false}
                                        handleChange={(value) => {
                                            setLote(value)
                                            setFieldValue('lote', {id: value.value})
                                        }} 
                                        defaultOptions={lote}   
                                        valid={errors.lote === 'Campo Requerido' ? false:true}     
                                        isClearable={false}                                                 
                                    />
                                    {errors.lote && <Form.Control.Feedback type="invalid" >{errors.lote}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>  
                            <Col xs="12" lg="3">
                                <Form.Group>
                                    <Form.Label>Monto <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.monto && 'error'} form-control`}
                                        type="number"
                                        name="monto"
                                    /> 
                                    {errors.monto && <Form.Control.Feedback type="invalid" >{errors.monto}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                    
                        </Row>       
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/cuota-inicial-proyecto" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>                
                    </Form>
                )}            
                </Formik>
        </div>
    )

}
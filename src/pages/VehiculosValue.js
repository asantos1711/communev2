import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import { useHistory, Link } from 'react-router-dom';
import Get from '../service/Get';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { VEHICULO_GET_BY_ID, VEHICULO_SAVE, LOTE_FOR_VEHICLES } from '../service/Routes'
import SelectAjax from '../components/SelectAjax';
import VehiculoSkeleton from '../loaders/VehiculoSkeleton';

export default function VehiculosValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    let history = useHistory()
    const [residente, setResidente] = useState(null)
    const [isValidResidente, setValidResidente] = useState(true)
    const [initialValues, setInitialValues] = useState({
        id: '', 
        placa: '',
        modelo: '',
        marca: '',
        color: ''
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${VEHICULO_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{       
                //console.log(response)  

                let entity ={
                    id: response.data.data.vehiculo.id,
                    placa: response.data.data.vehiculo.placa,
                    modelo:response.data.data.vehiculo.modelo,
                    marca: response.data.data.vehiculo.marca,   
                    color: response.data.data.vehiculo.color,                      
                }
                setInitialValues(entity)
                //residente
                setResidente({
                    'label': response.data.data.lote.name,
                    'value': response.data.data.lote.id,
                })
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        placa: Yup.string()
          .required('Campo Requerido'),
        modelo: Yup.string()
          .required('Campo Requerido'),         
        marca: Yup.string()
          .required('Campo Requerido'),
        color: Yup.string()
          .required('Campo Requerido'),
    });

    return(
        <div>
            {
                isLoadEntity ? <VehiculoSkeleton /> :
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {  
                        var validForm = true
                        if(residente===null || Object.keys(residente).length ===0 ){
                            validForm=false
                            setValidResidente(false)
                            setSubmitting(false)
                        }                        
                        if(validForm){
                            values["loteTransient"] = {id: residente.value}
                            //console.log(values)
                            Post({url: VEHICULO_SAVE, data: values,access_token: auth.data.access_token, header:true})
                            .then(response=>{
                                setSubmitting(false)
                                setFieldValue("id", response.data.data.id)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/operaciones/vehiculos")
                            })
                            .catch(error=>{
                                setSubmitting(false)
                                //console.log(error)
                                toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
                            }) 
                        }
                                               
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
                                    <Form.Label>Placa <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.placa && 'error'} form-control`}
                                        type="text"
                                        name="placa"
                                    />
                                    {errors.placa && <Form.Control.Feedback type="invalid" >{errors.placa}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Marca <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.marca && 'error'} form-control`}
                                        type="text"
                                        name="marca"
                                    />
                                    {errors.marca && <Form.Control.Feedback type="invalid" >{errors.marca}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Modelo <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.modelo && 'error'} form-control`}
                                        type="text"
                                        name="modelo"
                                    />
                                    {errors.modelo && <Form.Control.Feedback type="invalid" >{errors.modelo}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Color <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.color && 'error'} form-control`}
                                        type="text"
                                        name="color"
                                    />
                                    {errors.color && <Form.Control.Feedback type="invalid" >{errors.color}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Residente <span className="text-danger">*</span></Form.Label>
                                    <SelectAjax
                                        defaultValue={residente === null || Object.keys(residente).length === 0 ? false : residente}
                                        url={LOTE_FOR_VEHICLES}
                                        access_token={auth.data.access_token}
                                        isMulti={false}
                                        handleChange={(value) => {
                                            setResidente(value)
                                            setValidResidente(true)
                                        }} 
                                        defaultOptions={residente}   
                                        valid={isValidResidente}     
                                        isClearable={false}                                                 
                                    />  
                                    
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/operaciones/vehiculos" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )} 
                </Formik>
            }
        </div>
    )

}
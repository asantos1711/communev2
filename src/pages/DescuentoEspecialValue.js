import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useQuery from '../hook/useQuery'
import * as Yup from 'yup';
import Get from '../service/Get';
import { LOTE_FOR_VEHICLES, LOTE_GET_BY_ID,LOTE_DESCUENTO_ESPECIAL_SAVE } from '../service/Routes';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { Field, Formik } from 'formik';
import Post from '../service/Post';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import SelectAjax from '../components/SelectAjax';

export default function DescuentoEspecialValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [lote, setLote] = useState(null)
    const [initialValues, setInitialValues] = useState({
        id: '', 
        descuento: '',
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${LOTE_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                //console.log(response)
                let entity ={
                    id: response.data.data.id,
                    descuento: response.data.data.plusPercentMtto,                     
                }
                let nameAsociado = response.data.data.residenteLotes.filter(x=>x.active===true && x.asociado===true).map(elem=>elem.residente.name)
                //console.log(nameAsociado)
                let texto = `${nameAsociado.length > 0 ? `Asociado: ${nameAsociado[0]}` : 'Sin asociado'}. Lote: ${response.data.data.referencia} `
                setLote({label: texto, value: response.data.data.id})
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                setLoadEntity(false)
                toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])
    const shemaValidate = Yup.object().shape({
        descuento: Yup.number()
            .positive("El %   no puede ser negativo")  
            .min(1, 'El % debe estar entre 1-100')
            .max(100, 'El % debe estar entre 1-100')
            .required('Campo Requerido'),
        id: Yup.number()
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
                        Post({url: LOTE_DESCUENTO_ESPECIAL_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/descuento-especial")
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
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Descuento especial <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.descuento && 'error'} form-control`}
                                        name="descuento" 
                                    />
                                    {errors.descuento && <Form.Control.Feedback type="invalid" >{errors.descuento}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>    
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Lote <span className="text-danger">*</span></Form.Label>
                                    <SelectAjax
                                        defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                        url={LOTE_FOR_VEHICLES}
                                        access_token={auth.data.access_token}
                                        isMulti={false}
                                        handleChange={(value) => {
                                            setLote(value)
                                            setFieldValue('id', value.value)
                                        }} 
                                        defaultOptions={lote}   
                                        valid={errors.id === 'Campo Requerido' ? false:true}     
                                        isClearable={false}                                                 
                                    />                                    
                                </Form.Group>
                            </Col>                                                                    
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/descuento-especial" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}
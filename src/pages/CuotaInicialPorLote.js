import { Field, Formik } from "formik";
import React, { useState } from "react"
import { Button, Card, Col } from "react-bootstrap";
import { Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { toast } from "react-toastify";
import * as Yup from 'yup';
import SelectAjax from "../components/SelectAjax";
import { loaderRequest } from "../loaders/LoaderRequest";
import Post from "../service/Post";
import { CARGO_CUOTA_INICIAL_SAVE, LOTE_FOR_VEHICLES } from "../service/Routes";

export default function CuotaInicialPorLote({access_token, selectOpt}){
    const history = useHistory()
    const [lote, setLote] = useState(null)
    
    const [initialValues, setInitialValues] = useState({
        id: '', 
        lote: '',
        cuotaInicial: ''
    })

    const shemaValidate = Yup.object().shape({
        lote: Yup.string()
            .required('Campo Requerido'),
        cuotaInicial: Yup.string()
            .required("Campo requerido")
    });

    return(
        <Card className="shadow">
            <Card.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => {   
                        console.log(values)
                        let data = Object.assign({}, values)
                        data['cuotaInicial'] = {id: values.cuotaInicial}
                        Post({url: CARGO_CUOTA_INICIAL_SAVE, data: data,access_token: access_token, header:true})
                        .then(response=>{
                            if(response.data.success){
                                setSubmitting(false)
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.replace(`/pagar-cuota-inicial/${response.data.data.id}`)
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
                        <Row>
                            <Col xs="12" lg="8">
                                <Form.Group>
                                    <Form.Label>Lote<span className="text-danger">*</span></Form.Label>
                                    <SelectAjax
                                        defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                        url={LOTE_FOR_VEHICLES}
                                        access_token={access_token}
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
                                    <Form.Label>Tipo cuota inicial <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.cuotaInicial && 'error'} form-control`}
                                        as="select"
                                        name="cuotaInicial"
                                    >
                                        <option value="">Seleccionar opción</option>
                                            {
                                                selectOpt.map((item,i)=>(
                                                    <option key={i} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                    </Field> 
                                    {errors.cuotaInicial && <Form.Control.Feedback type="invalid" >{errors.cuotaInicial}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                    
                        </Row>       
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/uota-inicial-generadas" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>                
                    </Form>
                )}            
                </Formik>
            </Card.Body>
        </Card>
    )

}
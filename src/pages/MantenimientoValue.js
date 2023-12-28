import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import {MANTENIMIENTO_GET_BY_ID,MANTENIMIENTO_SAVE, REGLAS_GET} from '../service/Routes'
import * as Yup from 'yup';
import { Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button, InputGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { Link, useHistory } from 'react-router-dom';
import SelectAjax from '../components/SelectAjax';
import { BsQuestionCircleFill } from "react-icons/bs";
import Skeleton from 'react-loading-skeleton';

export default function MantenimientoValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    const [reglas, setReglas] = useState([])
    const history = useHistory()

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        cuota: '',
        description: '',
        diaCorte: '',
        tipoLote: '',
        validoMetrosVivienda: ''
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${MANTENIMIENTO_GET_BY_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{ 
                if(response.data.data.reglasList.length > 0){
                    setReglas(response.data.data.reglasList.map((element)=> ({
                        'label': `${element.name}`,
                        'value': element.id
                    })))
                }        
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name, 
                    cuota: response.data.data.cuota,
                    description: response.data.data.description,
                    diaCorte: response.data.data.diaCorte,
                    tipoLote: response.data.data.tipoLote,
                    validoMetrosVivienda: response.data.data.validoMetrosVivienda == null ? '' : response.data.data.validoMetrosVivienda
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
          .min(3, 'Muy corto!')
          .required('Campo Requerido'),
        validoMetrosVivienda: Yup.number()
          .notRequired()  
          .positive("El campo no puede ser negativo")  
          .min(1, 'El campo no puede ser menor a 1'),
        cuota: Yup.number()
          .positive("No puede poner una cuota negativa")  
          .min(1, 'La cuota mínima no puede ser menor a 1')
          .required('Campo Requerido'),
        diaCorte: Yup.number()
          .required('Campo Requerido')
          .positive("No puede poner una día negativo")  
          .min(1, 'El día mínimo no puede ser menor a 1')
          .max(31, 'El día máximo no puede ser mayor a 31'),
        tipoLote: Yup.string()
          .required('Campo Requerido'),
    });

    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton height={400}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => { 
                        //console.log(values)  
                        const d={
                            id: values.id,
                            name: values.name,
                            cuota: values.cuota,
                            description: values.description,
                            diaCorte :values.diaCorte,
                            tipoLote: values.tipoLote,
                            validoMetrosVivienda: values.validoMetrosVivienda,
                            reglasList: reglas != null && reglas.length > 0 ? reglas.map(r=>{return {id: r.value}}) : [] ,
                            
                        }
                        Post({url: MANTENIMIENTO_SAVE, data: d,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            setFieldValue("id", response.data.data.id)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/admin/mantenimiento")
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
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Día de pago <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.diaCorte && 'error'}`}
                                        type="number"
                                        name="diaCorte" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.diaCorte} 
                                    />                                    
                                    {errors.diaCorte && <Form.Control.Feedback type="invalid" >{errors.diaCorte}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Tipo de Mantenimiento <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="select" className={`${errors.tipoLote && 'error'}`}
                                        name="tipoLote"  
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.tipoLote}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="condominal">Condominal</option>
                                        <option value="habitacional">Habitacional</option>
                                        <option value="comercial">Comercial</option>
                                    </Form.Control>  
                                    {errors.tipoLote && <Form.Control.Feedback type="invalid" >{errors.tipoLote}</Form.Control.Feedback>}                                     
                                </Form.Group>
                            </Col>  
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Cuota <span className="text-danger">*</span></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control className={`${errors.cuota && 'error'}`}
                                            type="number"
                                            name="cuota" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cuota} 
                                        />
                                    </InputGroup>                                    
                                    {errors.cuota && <Form.Control.Feedback type="invalid" >{errors.cuota}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>  
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Superficicie <small>(m²)</small> {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regla si desea aplicar para aplicar a un mantenimiento por longitud</Tooltip>}>
                                        <BsQuestionCircleFill />
                                    </OverlayTrigger>                                        
                                    </Form.Label>
                                    <Form.Control className={`${errors.validoMetrosVivienda && 'error'}`}
                                        type="number"
                                        name="validoMetrosVivienda"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.validoMetrosVivienda} 
                                    >                                     
                                    </Form.Control>
                                    <Form.Text className="text-muted">
                                         
                                    </Form.Text>
                                    {errors.validoMetrosVivienda && <Form.Control.Feedback type="invalid" >{errors.validoMetrosVivienda}</Form.Control.Feedback>} 
                                </Form.Group>
                            </Col>   
                            <Col xs lg="8">
                                <Form.Group>
                                    <Form.Label>Reglas de descuento</Form.Label>
                                    <SelectAjax
                                        defaultValue={reglas !=null && reglas.length === 0 ? [] : reglas}
                                        url={REGLAS_GET}
                                        access_token={props.auth.data.access_token}
                                        isMulti={true}
                                        handleChange={setReglas} 
                                        defaultOptions={[]}   
                                        valid={true}  
                                        isClearable={true}                                                    
                                    />    
                                </Form.Group>
                            </Col>                          
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
                                <Link to="/admin/mantenimiento" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}
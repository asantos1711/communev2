import { Field, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import { authContext } from "../../context/AuthContext";
import Get from "../../service/Get";
import { AMENIDAD_AGENDA_SAVE, LOTE_GET, TIPOAMENIDAD_GET_ACTIVAS } from "../../service/Routes";
import * as Yup from 'yup';
import { loaderRequest } from "../../loaders/LoaderRequest";
import DatePicker from "react-datepicker";
import moment from "moment";
import { FaCheckCircle } from "react-icons/fa";
import Post from "../../service/Post";
import { toast } from "react-toastify";

export default function FormAgenda(){
    const { auth } = useContext(authContext)
    const [tipoAmenidadesOpt, setTipoAmenidadesOpt]  = useState([])
    const [initialValues, setInitialValues] = useState({
        id: '', 
        tipoAmenidad: '',
        amenidadFechasList: [],
        loteList: [],
        aforoMaximo: 10,
        diasAnteriores: 0,
        estado: 'disponible',
        estadoDescripcion: ''
    });
    const [fechas, setFechas] = useState([])
    const [fechaInicial, setFechaInicial] = useState(new Date())
    const [fechaFinal, setFechaFinal] = useState(new Date())
    const [horaInicial, setHoraInicial] = useState('')
    const [horaFinal, setHoraFinal] = useState('')
    const [duracion, setDuración] = useState('')
    const [horarios, setHorarios] = useState([])
    const [lote, setLote] = useState('')
    const [lotesOpt, setLotesOpt] = useState([])
    const [todosLotes, setTodosLotes] = useState(false)
    const [errorForm, setErrorForm] = useState(false)

    useEffect(() => {
        //amenidades
        Get({url: TIPOAMENIDAD_GET_ACTIVAS, access_token: auth.data.access_token})
        .then(response=>{           
            setTipoAmenidadesOpt(response.data)
        })
        .catch(error=>{
            //todo console the error
        })

        Get({url: `${LOTE_GET}/condominal`, access_token: auth.data.access_token})
        .then(response=>{
            setLotesOpt(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    const shemaValidate = Yup.object().shape({
        
    });

    const handleRangeDate = (fechaInicial, fechaFinal) => {
        if(fechaInicial !==null && fechaFinal !== null){
            let now = moment(fechaInicial).clone();
            let dates = []
            while (now.isSameOrBefore(fechaFinal)) {
                dates.push(now.format('YYYY-MM-DD'));
                now.add(1, 'days');
            }
            //dates.push(moment(fechaFinal).format('YYYY-MM-DD'))
            setFechas(dates)
        }else{
            setFechas([])
        }
    }
    const handleHorario = () =>{  
        
        if(horaInicial!=='' && horaFinal!=='' && duracion!==''){
            let startInMinutes = moment(horaInicial, "HH:mm").hours()*60+moment(horaInicial, "HH:mm").minute()
            let endInMinutes = moment(horaFinal, "HH:mm").hours()*60+moment(horaFinal, "HH:mm").minute()
            let interval = moment(duracion, "HH:mm").hours()*60+moment(duracion, "HH:mm").minute()
            const times = [];
    
            for (let i = 0; startInMinutes < 24 * 60; i++) {
                if (startInMinutes > endInMinutes) break;
            
                var hh = Math.floor(startInMinutes / 60); // getting hours of day in 0-24 format        
                var mm = startInMinutes % 60; // getting minutes of the hour in 0-55 format        
                times[i] = ('0' + (hh % 24)).slice(-2) + ':' + ('0' + mm).slice(-2);        
                startInMinutes = startInMinutes + interval;
            }
            setHorarios(times)
        }else{
            setHorarios([])
        }
        
    }
    return(
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={shemaValidate}
                onSubmit={(values, { setSubmitting, setFieldValue }) => {
                    let data = {
                        tipoAmenidad: {id: values.tipoAmenidad},
                        amenidadFechasList: fechas.map(item=>({id: null, fecha: item, 
                            amenidadFechasAmenidadHorariosList: horarios.map(item=>({id:null, amenidadHorarios: {id: null, horario: item}, estado: values.estado, estadoDescripcion: values.estadoDescripcion}))})),
                        loteList: values.loteList,
                        aforoMaximo: values.aforoMaximo,
                        diasAnteriores: values.diasAnteriores,
                    }   
                    
                    console.log(data)

                    if(data.tipoAmenidad.id === null || horarios.length === 0 || fechas.length === 0 || data.loteList.length === 0
                        || data.aforoMaximo <= 0){
                            setSubmitting(false)
                            console.log('error')
                            setErrorForm(true)
                    }else{
                        setErrorForm(false)
                        console.log(data)  
                        Post({url: AMENIDAD_AGENDA_SAVE, data: data,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(response.data.success){
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                            }else{
                                toast.error(response.data.message,{ autoClose: 8000 })
                            }
                            
                            console.log(response)
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
                            console.log(error)
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
                <Form className="form" onSubmit={handleSubmit}>
                    {isSubmitting && loaderRequest()}
                    {
                        errorForm && <div className="text-danger">El formulario no está correcto verifique los campos obligatorios</div>
                    }
                    <Row>
                        <Col xs={12} lg="12">
                            <Form.Group>
                                <Form.Label>Amenidad <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.tipoAmenidad && 'error'} form-control`}
                                    name="tipoAmenidad" 
                                    as="select"
                                >
                                    <option value=''>Seleccionar opción</option>
                                    {
                                        tipoAmenidadesOpt.map((item)=>(
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))
                                    }
                                </Field>
                                {errors.tipoAmenidad && <Form.Control.Feedback type="invalid" >{errors.tipoAmenidad}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="12">
                            <Form.Group>
                                <Form.Label>Lote condiminal <span className="text-danger">*</span></Form.Label>
                                <Form.Check 
                                    type="checkbox"
                                    checked={todosLotes}
                                    onChange={e=>{
                                        if(e.target.checked){
                                            setLote('')
                                        }
                                        setTodosLotes(e.target.checked)
                                        setFieldValue('loteList', lotesOpt.map(item=>({id: item.id})))
                                    }}
                                    label="Todos"
                                />{' '}   
                                {!todosLotes && <Form.Control 
                                    className={`${errors.loteList && 'error'} form-control`}
                                    value={lote}
                                    onChange={e=>{
                                        setLote(e.target.value)
                                        setFieldValue('loteList', lotesOpt.filter(item=>item.id==e.target.value).map(e=>({id: e.id})))
                                    }}
                                    as="select"
                                    disabled={todosLotes}
                                >
                                    <option value=''>Seleccionar opción</option>
                                    {
                                        lotesOpt.map((item)=>(
                                            <option value={item.id} key={item.id}>{`ref: ${item.referencia}. Propietario: ${item.residente_name}`}</option>
                                        ))
                                    }
                                </Form.Control>}
                                {errors.loteList && <Form.Control.Feedback type="invalid" >{errors.loteList}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col> 
                        <Col xs={12} lg="6">
                            <Form.Group>
                                <Form.Label>Días anteriores para reservar <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.diasAnteriores && 'error'} form-control`}
                                    name="diasAnteriores" 
                                    as="select"
                                >
                                    <option value={0}>Mismo día</option>
                                    <option value={1}>1 día anterior</option>
                                    <option value={2}>2 días anteriores</option>
                                    <option value={3}>3 días anteriores</option>
                                    <option value={4}>4 días anteriores</option>
                                    <option value={5}>5 días anteriores</option>
                                </Field>
                                {errors.diasAnteriores && <Form.Control.Feedback type="invalid" >{errors.diasAnteriores}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="6">
                            <Form.Group>
                                <Form.Label>Aforo máximo <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.aforoMaximo && 'error'} form-control`}
                                    name="aforoMaximo" 
                                    type="number"
                                    min={1}
                                />
                                {errors.aforoMaximo && <Form.Control.Feedback type="invalid" >{errors.aforoMaximo}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="12">
                            <Form.Group>
                                <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                                <Field 
                                    className={`${errors.estado && 'error'} form-control`}
                                    name="estado" 
                                    as="select"
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="ocupado">Ocupado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="bloqueado">Bloqueado</option>
                                </Field>
                                {errors.estado && <Form.Control.Feedback type="invalid" >{errors.estado}</Form.Control.Feedback>}                            
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg="12">
                            <Form.Group>
                                <Form.Label>Comentario </Form.Label>
                                <Form.Control as="textarea" rows="3"
                                    name="estadoDescripcion" 
                                    onChange={e=>setFieldValue('estadoDescripcion', e.target.value)}
                                    value={values.estadoDescripcion}
                                />                            
                            </Form.Group>
                        </Col>
                        <Col xs="12" lg="6">
                            <Form.Group>
                            <Form.Label>Fecha Inicial <span className="text-danger">*</span></Form.Label>
                            <DatePicker className="form-control"
                                showPopperArrow={false}
                                selected={fechaInicial}
                                minDate={new Date()}
                                autoComplete="off"
                                dateFormat="dd-MM-yyyy"
                                selectsStart
                                startDate={fechaInicial}
                                endDate={fechaFinal}
                                onChange={date => {
                                    if(date===null){
                                        setFechaInicial(new Date())
                                    }else{
                                        setFechaInicial(date)
                                        if(date>fechaFinal){
                                            setFechaFinal(date)
                                        }                                        
                                    }
                                    handleRangeDate(date, fechaFinal)                                                                
                                }}
                            />
                            </Form.Group>
                        </Col> 
                        <Col xs="12" lg="6">
                            <Form.Group>
                            <Form.Label>Fecha Final <span className="text-danger">*</span></Form.Label>
                            <DatePicker className="form-control"
                                showPopperArrow={false}
                                selected={fechaFinal}
                                autoComplete="off"
                                dateFormat="dd-MM-yyyy"
                                minDate={fechaInicial}
                                onChange={date => {
                                    if(date===null){
                                        setFechaFinal(new Date())
                                    }else{
                                        setFechaFinal(date)
                                    }   
                                    handleRangeDate(fechaInicial, date)                                                             
                                }}
                                selectsEnd
                                startDate={fechaInicial}
                                endDate={fechaFinal}
                            />
                            </Form.Group>
                        </Col> 
                        <Col xs="12" lg="12">
                            <Form.Group>
                                <span className="text-muted ft-0-8rem">Fechas generados</span>
                                <Dropdown.Divider />
                                {fechas.length > 0 &&
                                <div style={{display: 'block', backgroundColor: '#ccc', maxHeight: '150px', overflowY: 'auto', padding: '4px'}}>
                                    {
                                        fechas.map((item)=>(
                                            <span key={item} className="badge badge-pill bg-light m-1">{item}</span>
                                        ))
                                    }
                                </div>}
                                {fechas.length === 0 && <Form.Control.Feedback type="invalid" >Debe seleccionar un rango de fechas</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        
                        <Col xs="12" lg="4">
                            <Form.Group>
                                <Form.Label>Empieza <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="time"
                                    value={horaInicial}
                                    onChange={e=>setHoraInicial(e.target.value)}
                                />
                            </Form.Group>
                        </Col> 
                        <Col xs="12" lg="4">
                            <Form.Group>
                                <Form.Label>Termina <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="time"
                                    value={horaFinal}
                                    onChange={e=>setHoraFinal(e.target.value)}
                                />
                            </Form.Group>
                        </Col>   
                        <Col xs="12" lg="4">
                        <Form.Group>
                            <Form.Label>Duración <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        value={duracion}
                                        onChange={e=>setDuración(e.target.value)}
                                        type="time"
                                    />
                                    <Button variant="outline-secondary" id="button-addon2" size='sm'>
                                        <FaCheckCircle onClick={handleHorario} title="Generar horarios"/>
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Col> 
                        <Col xs="12" lang="12">
                            <Form.Group>
                                <span className="text-muted ft-0-8rem">Horarios generados</span>
                                <Dropdown.Divider />
                                {horarios.length > 0 &&
                                <div style={{display: 'block', backgroundColor: '#ccc', maxHeight: '150px', overflowY: 'auto', padding: '4px'}}>
                                    {
                                        horarios.map((item)=>(
                                            <span key={item} className="badge badge-pill bg-light m-1">{item}</span>
                                        ))
                                    }
                                </div>}
                                {horarios.length === 0 && <Form.Control.Feedback type="invalid" >Debe generar los horarios</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>                                                                   
                    </Row>                                               
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                        </Col>
                    </Row>
                </Form>
            )}            
            </Formik>
        </>
    )

}
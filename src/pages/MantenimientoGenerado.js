import React, { useContext, useState, useEffect } from 'react'
import { authContext } from '../context/AuthContext'
import { Row, Col, Card } from 'react-bootstrap'
import MttoGeneradoStatics from '../components/MttoGeneradoStatics'
import Get from '../service/Get'
import { MTTO_GENERADO_GET, MTTO_GENERADO_GET_BY_STATUS } from '../service/Routes'
import MttoGeneradoSkeleton from '../loaders/MttoGeneradoSkeleton'
import MttoGeneradoSearch from '../components/MttoGeneradoSearch'
import MttoGeneradoList from '../components/MttoGeneradoList'
import Skeleton from 'react-loading-skeleton'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import MantenimientoGeneradoNuevo from './MantenimientoGeneradoNuevo'
import { ToastContainer, toast } from 'react-toastify'
import moment from 'moment'

export default function MantenimientoGenerado(){
    const { auth } = useContext(authContext)
    const [mes, setMes] = useState(7)
    const [fecha, setFecha] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false)

    const[countCondos, setCountCondos] = useState(0)
    const[countHabitacional, setCountHabitacional] = useState(0)
    const[countComercial, setCountComercial] = useState(0)
    const[listByStatus, setListByStatus] = useState([0,0,0,0,0,0])
    const [items, setItems] = useState([])

    const[isLoadingPie, setLoadingPie] = useState(false)
    let {path, url} = useRouteMatch();

    useEffect(()=>{
        setIsLoading(true)
        Get({url: `${MTTO_GENERADO_GET}/${moment(fecha).format("M")}/${moment(fecha).format("yyyy")}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setCountCondos(response.data.data.countCondos)
            setCountHabitacional(response.data.data.countHabitacion)
            setCountComercial(response.data.data.countComercio)
            setListByStatus(response.data.data.countByStatus)
            setItems(response.data.data.loteList)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log("error")
            // console.log(error)
            setIsLoading(false)
        })
    }, [fecha, auth.data.access_token])

    const handleChangeRadio = e  =>{
        setLoadingPie(true)
        Get({url: `${MTTO_GENERADO_GET_BY_STATUS}/${moment(fecha).format("M")}/${moment(fecha).format("yyyy")}/${e.target.value}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setListByStatus(response.data.data.countByStatus)
            setItems(response.data.data.loteList)
            setLoadingPie(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("Ha ocurrido un error. Intente más tarde o contacte con el administrador", {autoClose: 8000})
            setLoadingPie(false)
        })
    }   

    return(
        
        <div>
            <ToastContainer />
            {
                isLoading
                ? <MttoGeneradoSkeleton />
                : 
                <div>
                    <Switch>
                        <Route path={path} exact>
                            <Row>
                                <Col className="mb-4">
                                    <MttoGeneradoSearch fecha={fecha} setFecha={setFecha} handleMes={e=>setMes(e.target.value)} url={url} />
                                </Col>            
                            </Row>
                            <Row>
                                <Col className="mb-4">
                                    <MttoGeneradoStatics 
                                        isLoadingPie={isLoadingPie}
                                        countCondos={countCondos} 
                                        countHabitacional={countHabitacional} 
                                        countComercial={countComercial}
                                        listByStatus={listByStatus}
                                        handleChangeRadio={handleChangeRadio}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card className="shadow">
                                        <Card.Body>                  
                                            <Row>
                                                <Col>
                                                    {
                                                        isLoadingPie
                                                        ? <Skeleton height={391} />
                                                        : <MttoGeneradoList items={items}/>

                                                    }
                                                    
                                                </Col>
                                            </Row>                                                  
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Route>
                        <Route exact path={`${path}/nuevo`}>
                            <MantenimientoGeneradoNuevo access_token={auth.data.access_token}/>
                        </Route>
                        
                    </Switch>
                    
                </div>
            }
            
        </div>
        
    )

}
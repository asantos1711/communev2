import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaBuilding, FaPiggyBank } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Indicator({totales}){
    return(
            <Col>
                <Container>
                    <Row className="justify-content-center cl-indicator">
                        <Col xs="3" lg="3" className="tile_stats_count">
                        <span className="title-count"><FaBuilding className="mb-1"/>  Total de lotes</span>
                        <div className="count">{totales[0]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaBuilding className="mb-1"/>  Lotes entregados</span>
                            <div className="count">{totales[1]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaBuilding className="mb-1"/>  Lotes disponibles</span>    
                            <div className="count">{totales[2]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaBuilding className="mb-1"/>  Lotes domiciliados</span>    
                            <div className="count">{totales[3]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count bl-0">
                            <span className="title-count"><FaPiggyBank className="mb-1"/>  Pagos de hoy</span>    
                            <div className="count">{totales[4]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaPiggyBank className="mb-1"/>  Pagos de la semana</span>    
                            <div className="count">{totales[5]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaPiggyBank className="mb-1"/>  Pagos del mes</span>    
                            <div className="count">{totales[6]}</div>
                        </Col>
                        <Col xs="3" lg="3" className="tile_stats_count">
                            <span className="title-count"><FaPiggyBank className="mb-1"/>  Pagos atrasados</span>    
                            <div className={`count`}><Link to='/reportes/pagos-atrasados' className={`${totales[7]>0 && 'text-danger'}`}>{totales[7]}</Link></div>
                        </Col>
                    </Row>
                </Container>
            </Col>
    )
}
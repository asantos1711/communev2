import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Multas from '../components/Multas'
import ReglasDescuentos from '../components/ReglasDescuentos'
import ResidenteExtraInfo from '../components/ResidenteExtraInfo'
import FacturaNomencladores from '../components/FacturaNomencladores'
import PagosComp from '../components/PagosComp'
import DescuentoEspecialComp from '../components/DescuentoEspecialComp'
import OtrasCuotasComp from '../components/OtrasCuotasComp'
import FusionLotesComp from '../components/FusionLotesComp'
import InactivarLotesComp from '../components/InactivarLotesComp'
import CancelarDeudasComp from '../components/CancelarDeudasComp'

export default function Catalogos(){
    return(
        <Row>
            <Col xs lg="4" className="mb-4">
                <Multas />
            </Col>
            <Col xs lg="4" className="mb-4">
                <ReglasDescuentos />
            </Col>  
            <Col xs lg="4" className="mb-4">
                <ResidenteExtraInfo />
            </Col>
            <Col xs lg="4" className="mb-4">
                <FacturaNomencladores />
            </Col>  
            <Col xs lg="4" className="mb-4">
                <PagosComp />
            </Col>   
            <Col xs lg="4" className="mb-4">
                <DescuentoEspecialComp />
            </Col>    
            <Col xs lg="4" className="mb-4">
                <OtrasCuotasComp />
            </Col>    
            <Col xs lg="4" className="mb-4">
                <FusionLotesComp />
            </Col>
            <Col xs lg="4" className="mb-4">
                <InactivarLotesComp />
            </Col>
        </Row>


    )
}
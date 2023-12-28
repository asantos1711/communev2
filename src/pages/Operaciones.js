import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Lotes from '../components/Lotes'
import Residentes from '../components/Residentes'
import DatosFiscalesComp from '../components/DatosFiscalesComp'
import { isTags } from '../security/isTags'


export default function Operaciones({auth}){
    return(
        <Row>
            {!isTags(auth.data.role) && <Col xs lg="4" className="mb-4">
                <Lotes />
            </Col>}
            <Col xs lg="4" className="mb-4">
                <Residentes auth={auth}/>
            </Col>
            {!isTags(auth.data.role) && <Col xs lg="4" className="mb-4">
                <DatosFiscalesComp />
            </Col> }          
        </Row>


    )
}
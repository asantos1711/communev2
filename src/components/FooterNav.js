import React from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import config from "../../package.json"

export default function FooterNav(){
    return(
        <footer className="footer">
            <Container>
                <Row>
                    <Col xs="12" md="6" className='text-md-center text-muted'>
                    © Todos los derechos reservados
                    </Col>
                    <Col xs="12" md="6" className='font-size-08rem text-muted text-right'>
                        v {config.version}
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
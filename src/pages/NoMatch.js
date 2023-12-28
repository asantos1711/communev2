import React from 'react'
import { Container, Row, Col, Jumbotron } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NoMatch(){
    return(
        <Container>
            <Row className="justify-content-md-center">
                <Col xs lg>
                    <Jumbotron>
                        <h1>Página no encontrada</h1>
                        <p>
                            Por favor redirigase al <Link to="/">inicio</Link>
                        </p>
                    </Jumbotron>
                </Col>
            </Row>
        </Container>
    )
}
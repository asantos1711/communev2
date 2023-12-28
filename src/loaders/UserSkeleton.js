import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function UserSkeleton(){
    return(
        <Form className="mt-4 form">
            <Row>
                <Col xs lg="4">
                    <Form.Group>
                        <Skeleton height={24} width='100%'/>
                    </Form.Group>                    
                </Col>
                <Col xs lg="4">
                    <Form.Group>
                        <Skeleton height={24} width='100%'/>
                    </Form.Group>
                </Col>
                <Col xs lg="4">
                    <Form.Group>
                        <Skeleton height={24} width='100%'/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>                
                <Col xs lg="4">
                    <Form.Group>
                        <Skeleton height={24} width='100%'/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs lg="4">
                    <Form.Group>
                        <Skeleton height={24} width='100%'/>
                    </Form.Group>
                </Col>
            </Row>            
        </Form>
    )
}
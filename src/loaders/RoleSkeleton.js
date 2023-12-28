import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function RoleSkeleton(){
    return(
        <Form className="mt-4 form">
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
import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function MttoGeneradoSkeleton(){
    return(
        <div>
            <Row>
                <Col className="mb-4">
                    <Card>
                        <Card.Body>
                            <Skeleton height={110}></Skeleton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="mb-4">
                    <Card>
                        <Card.Body>
                            <Skeleton height={248}></Skeleton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="mb-4">
                    <Card>
                        <Card.Body>
                            <Skeleton height={391}></Skeleton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
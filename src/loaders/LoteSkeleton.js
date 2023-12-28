import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function LoteSkeleton(){
    return (
        <div>
            <Row>
                <Col xs lg="6">
                    <Row>
                        <Col>
                            <Card className="shadow mb-4">
                                <Card.Body>
                                    <Skeleton width="100%" height={369}></Skeleton>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="shadow mb-4">
                                <Card.Body>
                                    <Skeleton width="100%" height={278}></Skeleton>
                                </Card.Body>
                            </Card>                            
                        </Col>
                    </Row>
                </Col>
                <Col xs lg="6">
                     <Row>
                        <Col>
                            <Card className="shadow mb-4">
                                <Card.Body>
                                    <Skeleton width="100%" height={278}></Skeleton>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="shadow mb-4">
                                <Card.Body>
                                    <Skeleton width="100%" height={192}></Skeleton>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
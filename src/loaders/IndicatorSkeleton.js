import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function IndicatorSkeleton(){
    return(
        <Col>
            <Container>
                <Row className="justify-content-center cl-indicator">
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count bl-0">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                    <Col xs="3" lg="3" className="tile_stats_count">
                        <Skeleton height={70} />
                    </Col>
                </Row>
            </Container>
        </Col>
    )
}
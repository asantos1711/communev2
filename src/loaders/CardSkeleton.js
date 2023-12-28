import React from 'react'
import { Card } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

export default function CardSkeleton(props){
    return(
        <Card>
            <Card.Body>
                <Skeleton height={props.height}></Skeleton>
            </Card.Body>
        </Card>
    ) 
}
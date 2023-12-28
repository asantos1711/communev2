import React from 'react'
import { Table } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'


export  default function TableSkeleton(){
    return(
        <Skeleton count={10} height={35}/>
    )
}
import React, { useEffect, useState, useContext } from 'react'
import useQuery from '../hook/useQuery'
import { Card, Row, Col, Jumbotron, Container} from 'react-bootstrap'
import Get from '../service/Get'
import { authContext } from '../context/AuthContext'
import {SEARCH_GLOBAL} from '../service/Routes'
import TableSkeleton from '../loaders/TableSkeleton'
import SearchList from '../components/SearchList'

export default function Search(){
    const query = useQuery()
    let q = query.get("q")
    let type = query.get("type")
    const [isSearching, setSearching] = useState(false)
    const { auth } = useContext(authContext)
    const [items, setItems] = useState([])   

    useEffect(()=>{
        setSearching(true)
        Get({url: `${SEARCH_GLOBAL}/${q}/${type}`, access_token: auth.data.access_token})
        .then(response=>{            
            //console.log(response)
            setItems(response.data.data)
            setSearching(false)
        })
        .catch(error=>{
            setItems([])
            // console.log('error')
            // console.log(error)
            setSearching(false)
        })
    }, [q, type])

    return(
        <Row className="justify-content-center">
            <Col xs lg="10">
                <Card className="shadow mb-4">
                    <Card.Body>
                        <Row>
                            <Col>
                            {
                                isSearching 
                                ? <TableSkeleton />
                                : items.length === 0
                                ? <Jumbotron fluid>
                                    <Container>
                                    <p className="text-info">
                                        No existe información acorde a la búsqueda realizada. 
                                        <br/>
                                        Intente de nuevo por favor.
                                    </p>
                                    </Container>
                                  </Jumbotron>
                                : <SearchList items={items} auth={auth}/>
                            }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>        
    )
}
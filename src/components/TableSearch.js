import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'


export default function TableSearch({columns, products}){   

    return(
        <div>
            <BootstrapTable 
                bordered={false}
                striped={false}
                hover={true}
                keyField='id' 
                data={ products } 
                columns={ columns } 
                pagination={ paginationFactory() }  />
        </div>
           
    )
}
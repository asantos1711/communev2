import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, {SizePerPageDropdownStandalone, PaginationProvider,PaginationListStandalone} from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'


export default function TableData({columns, products}){
    const { SearchBar } = Search;    

    return(
        <div>
            <PaginationProvider
                pagination={ paginationFactory({
                   custom: true,
                   totalSize: 11,
                   page: 1,
                   sizePerPage: 10,
                   sizePerPageList: [{
                       text: '10', value: 10
                   }, {
                       text: '30', value: 30
                   }, {
                       text: 'All', value: products.length
                   }],
                   hideSizePerPage: products.length === 0
                }) }
                keyField='id'
                columns={ columns }
                data={ products }
            >
                {
                        ({
                            paginationProps,
                            paginationTableProps
                        }) => (
                            <ToolkitProvider
                                keyField='id'
                                columns={ columns }
                                data={ products }
                                search
                            >
                                {
                                    toolkitprops => (
                                        <div>
                                            <div className="right-floating-section">
                                                <div className="right-floating-subsection">
                                                    <SearchBar placeholder="Buscar" className="col-lg-4 float-right mb-2" { ...toolkitprops.searchProps } />
                                                </div>
                                            </div>

                                            <div>
                                                <BootstrapTable
                                                    { ...toolkitprops.baseProps }
                                                    { ...paginationTableProps }
                                                    hover
                                                    condensed
                                                    striped
                                                    noDataIndication="No hay información disponible"
                                                />
                                                <SizePerPageDropdownStandalone
                                                    { ...paginationProps }
                                                />
                                                <PaginationListStandalone
                                                    { ...paginationProps }
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        )
                    }
            </PaginationProvider>  
        </div>
           
    )
}
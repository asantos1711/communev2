import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  PROVEEDOR_GET,
  PROVEEDOR_DELETE,
  ORDENCOMPRA_GET,
  ORDENCOMPRA_CANCELARORDEN,
  ORDENCOMPRA_PAGINABLE,
} from "../../service/Routes";
import { Button, Col, Collapse, Table } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import Get from "../../service/Get";
import Delete from "../../service/Delete";
import { loaderRequest } from "../../loaders/LoaderRequest";
import TableSkeleton from "../../loaders/TableSkeleton";
import TableData from "../../components/TableData";
import { formatNumber } from "../../utils/formatNumber";
import moment from "moment";
import { RiCloseCircleLine, RiDeleteBinLine } from "react-icons/ri";
import { Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { estatusOpt, estatuspagoOpt } from "./OrdenCompraValue";
import DatePicker from "react-datepicker";
import { FaSearch } from "react-icons/fa";

export default function OrdenCompraList({ auth, handleIsEditing, path }) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isDeleteId, setIsDeleteId] = useState(false);
  let history = useHistory();
  //paginado
  const [openFilter, setOpenFilter] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(0);
  const [cantidadElementos, setCantidadElementos] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [next, setNext] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [estatus, setEstatus] = useState("");
  const [estatusPago, setEstatusPago] = useState("");
  const [proveedorOpt, setProveedorOpt] = useState([]);

  useEffect(() => {
    const fetchProveedorApi = async () => {
      try {
        const response = await Get({
          url: PROVEEDOR_GET,
          access_token: auth.data.access_token,
        });
        setProveedorOpt(response.data);
        console.log(response);
      } catch (error) {}
    };
    fetchProveedorApi();
  }, []);

  useEffect(() => {
    DataList();
  }, [pageNo]);

  const DataList = () => {
    setIsLoading(true);
    Get({
      url: `${ORDENCOMPRA_PAGINABLE}?page=${pageNo}&size=${pageSize}&sortBy=${sortBy}${
        proveedorId && `&proveedorId=${proveedorId}`
      }${estatus && `&estatus=${estatus}`}${
        estatusPago && `&estatusPago=${estatusPago}`
      }${startDate && `&dateIni=${moment(startDate).format("YYYY-MM-DD")}`}${
        endDate && `&dateFin=${moment(endDate).format("YYYY-MM-DD")}`
      }`,
      access_token: auth.data.access_token,
    })
      .then((response) => {
        setItems(response.data.ordenCompraList);
        setPrevious(response.data.previous);
        setNext(response.data.next);
        setCantidadElementos(response.data.total);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(
          "No se puede obtener la informacion en este momento. Intente más tarde",
          { autoclose: 8000 }
        );
      });
  };

  const deleteItem = (data) => {
    setIsDeleteId(true);
    Delete({
      url: `${ORDENCOMPRA_CANCELARORDEN}/${data.id}`,
      access_token: auth.data.access_token,
    })
      .then((response) => {
        setIsDeleteId(false);
        if (!response.data.success) {
          toast.info(response.data.message, { autoClose: 10000 });
        } else {
          toast.success("Acción exitosa", { autoClose: 2000 });
          DataList();
        }
      })
      .catch((error) => {
        // console.log('error')
        // console.log(error)
        toast.error("No se puede ejecutar la acción. Intente más tarde", {
          autoClose: 3000,
        });
      });
  };
  const editItem = (data) => {
    handleIsEditing(true);
    history.push(`${path}/value?id=${data.id}`);
  };

  const handlePrev = (e) => {
    setPageNo(pageNo - 1);
  };
  const handleNext = (e) => {
    setPageNo(pageNo + 1);
  };
  const onClickBuscar = (e) => {
    setPageNo(0);
    DataList();
  };

  const handleStartDate = (date) => {
    //console.log(date)
    if (date === null || date === "") {
      setStartDate("");
      setEndDate("");
    } else {
      setStartDate(date);
      if (date > endDate) {
        setEndDate(date);
      }
    }
  };
  const handleEndDate = (date) => {
    if (date === null || date === "") {
      setEndDate(startDate);
    } else {
      if (startDate === "" || startDate === null) {
        setStartDate(date);
      }
      setEndDate(date);
    }
  };

  return (
    <div>
      {isDeleteId ? loaderRequest() : null}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Row>
          <Col xs="12" md="12">
            <Collapse in={openFilter}>
              <div>
                <Row>
                  <Col xs="12" md="12">
                    <Row>
                      <Col xs="12" md="3">
                        <Form.Group>
                          <Form.Label className="m-0">Proveedor</Form.Label>
                          <Form.Control
                            as="select"
                            value={proveedorId}
                            onChange={(e) => setProveedorId(e.target.value)}
                          >
                            <option value="">Seleccionar opción</option>
                            {proveedorOpt.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.nombre}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col xs="12" md="2">
                        <Form.Group>
                          <Form.Label className="m-0">Estado</Form.Label>
                          <Form.Control
                            as="select"
                            value={estatus}
                            onChange={(e) => setEstatus(e.target.value)}
                          >
                            <option value="">Seleccionar opción</option>
                            {estatusOpt.map((item) => (
                              <option value={item.id} key={item}>
                                {item}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col xs="12" md="2">
                        <Form.Group>
                          <Form.Label className="m-0">
                            Estado de pago
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={estatusPago}
                            onChange={(e) => setEstatusPago(e.target.value)}
                          >
                            <option value="">Seleccionar opción</option>
                            {estatuspagoOpt.map((item) => (
                              <option value={item.id} key={item}>
                                {item}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col xs="12" md="2">
                        <Form.Group>
                          <Form.Label className="m-0">
                            Fecha de acceso
                          </Form.Label>
                          <DatePicker
                            className="form-control"
                            dateFormat="dd-MM-yyyy"
                            locale="es"
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            selected={startDate}
                            onChange={(date) => handleStartDate(date)}
                            placeholderText="Desde"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs="12" md="2">
                        <Form.Label className="m-0 opacity-0">
                          Fecha de acceso
                        </Form.Label>
                        <DatePicker
                          className="form-control"
                          dateFormat="dd-MM-yyyy"
                          locale="es"
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          selected={endDate}
                          onChange={(date) => handleEndDate(date)}
                          placeholderText="Hasta"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" md="2">
                    <Button
                      variant="outline-primary"
                      block
                      onClick={(e) => onClickBuscar()}
                    >
                      <FaSearch /> Buscar
                    </Button>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </Col>
          <Col xs="12" md="12">
            <Table hover striped className="tableVertical font-size-08rem">
              <thead>
                <tr>
                  <th width="15%">Proveedor</th>
                  <th width="10%">Estado</th>
                  <th width="10%">Estado de pago</th>
                  <th width="10%">Fecha</th>
                  <th width="26%">Artículos</th>
                  <th width="9%">Precio</th>
                  <th width="10%">No. facturas</th>
                  <th width="10%"></th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.proveedor.nombre}</td>
                      <td>{item.estatus}</td>
                      <td>{item.estatusPago}</td>
                      <td>
                        {moment(item.createdAt, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                      <td>
                        {item.ordenCompraArticuloList.map((it, idx) => (
                          <ul key={`art-${idx}`}>
                            <li>Artículo: {it.articulo.nombre}</li>
                            <li>Presentación: {it.presentacion}</li>
                            <li>UM: {it.unidadMedida}</li>
                            <li>Precio unitario: {it.precioUnitario}</li>
                            <li>Cantidad: {it.cantidad}</li>
                          </ul>
                        ))}
                      </td>

                      <td>{formatNumber(item.precio)}</td>
                      <td>{item.numFacturas}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="btn-xs"
                          onClick={(e) => deleteItem(item.id)}
                        >
                          Cancelar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No existen valores a mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="d-flex flex-row-reverse">
              <ul className="pagination">
                <li
                  className={`${
                    !previous && "disabled"
                  } paginate_button page-item previous cursor-pointer`}
                  id="dataTable_previous"
                >
                  <span className="page-link" onClick={(e) => handlePrev()}>
                    Previous
                  </span>
                </li>
                <li
                  className={`${
                    !next && "disabled"
                  } paginate_button page-item next cursor-pointer`}
                  id="dataTable_next"
                >
                  <span className="page-link" onClick={(e) => handleNext()}>
                    Next
                  </span>
                </li>
              </ul>
              <span className="text-muted mr-5">
                Total de elementos {cantidadElementos}
              </span>
            </div>
          </Col>
        </Row>
        // <TableData columns={columns} products={items} />
      )}
    </div>
  );
}

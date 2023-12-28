import React from "react";
import {
  DropdownButton,
  Dropdown,
  Row,
  Col,
  OverlayTrigger,
  Popover,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiBuilding4Line, RiAlarmWarningLine } from "react-icons/ri";
import { FaMapMarkedAlt, FaUserAlt } from "react-icons/fa";
import { formatNumber } from "../utils/formatNumber";
import TableSearch from "./TableSearch";
import { getIconTipoLote } from "../utils/getIconTipoLote";
import { getIconCatHab } from "../utils/getIconCatHab";
import { getIconSubCatHab } from "../utils/getIconSubCatHab";
import { getIconCatConst } from "../utils/getIconCatConst";
import { getIconSubCatConst } from "../utils/getIconSubCatConst";
import { getIconRecurrente } from "../utils/getIconRecurrente";
import { IsObra } from "../security/IsObra";
import { IsConsultor } from "../security/IsConsultor";
import { isTags } from "../security/isTags";
import { getIconHasRepresentante } from "../utils/getIconHasRepresentante";
import { labelLote } from "../constant/token";

export default function SearchList({ items, auth }) {
  const actions = (cell, row) => {
    return (
      <div>
        {row.status === "entregado" ? (
          <div>
            {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) &&
            row.status !== "disponible" ? (
              <DropdownButton
                variant="light"
                id="dropdown-item-button"
                title="Acciones"
              >
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/estado-cuenta/${row.id_lote}`}
                    >
                      Estado de cuenta
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && row.paga_mtto && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/mantenimiento/lote/${row.id_lote}`}
                    >
                      Mantenimientos
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/deudas/${row.id_lote}`}
                    >
                      Deudas
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/generar-sancion/${row.id_lote}`}
                    >
                      Generar sanción
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/pagos/${row.id_lote}`}
                    >
                      Pagos
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_residente != null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/datos-contacto/${row.id_residente}/${row.id_lote}`}
                    >
                      Datos de contacto
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link position-relative"
                      to={`/nota/${row.id_lote}`}
                    >
                      Notas
                      {row.cant_notas > 0 && (
                        <span className="position-absolute badge badge-warning">
                          2
                        </span>
                      )}
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/alerta/${row.id_lote}`}
                    >
                      Alertas
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/generar-cuota/${row.id_lote}`}
                    >
                      Otras cuotas
                    </Link>
                  </Dropdown.Item>
                )}
              </DropdownButton>
            ) : IsObra(auth.data.role) || IsConsultor(auth.data.role) ? (
              <DropdownButton
                variant="light"
                id="dropdown-item-button"
                title="Acciones"
              >
                {row.id_residente && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/datos-contacto/${row.id_residente}/${row.id_lote}`}
                    >
                      Datos de contacto
                    </Link>
                  </Dropdown.Item>
                )}
              </DropdownButton>
            ) : (
              <DropdownButton
                variant="light"
                id="dropdown-item-button"
                title="Acciones"
              >
                {row.id_lote !== null && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/generar-sancion/${row.id_lote}`}
                    >
                      Generar sanción
                    </Link>
                  </Dropdown.Item>
                )}
                {row.id_residente && (
                  <Dropdown.Item as="button">
                    <Link
                      className="dropdown-link"
                      to={`/datos-contacto/${row.id_residente}/${row.id_lote}`}
                    >
                      Datos de contacto
                    </Link>
                  </Dropdown.Item>
                )}
              </DropdownButton>
            )}
          </div>
        ) : (
          <div>
            {!IsObra(auth.data.role) &&
              !IsConsultor(auth.data.role) &&
              !isTags(auth.data.role) &&
              row.status !== "disponible" && (
                <DropdownButton
                  variant="light"
                  id="dropdown-item-button"
                  title="Acciones"
                >
                  {row.id_lote !== null && (
                    <Dropdown.Item as="button">
                      <Link
                        className="dropdown-link"
                        to={`/estado-cuenta/${row.id_lote}`}
                      >
                        Estado de cuenta
                      </Link>
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              )}
          </div>
        )}
      </div>
    );
  };

  const infoGroupLote = (cell, row) => {
    return (
      <div>
        {row.status !== "fusionado" && row.status !== "inactivo" ? (
          <div>
            <span className="text-secondary d-block">
              <FaUserAlt className="mb-2" />{" "}
              {row.name === null ? "Sin asociado" : row.name}
            </span>
            <Row>
              <Col xs lg="6">
                <div>
                  <span className="text-secondary d-block">
                    <div className="d-flex justify-content-between">
                      <div>
                        <RiBuilding4Line className="mb-2" /> {row.referencia}
                      </div>
                    </div>
                  </span>
                  <span className="text-secondary d-block">
                    <FaMapMarkedAlt className="mb-2" />{" "}
                    {row.direccion.replace("Lote:", `${labelLote}:`)}
                  </span>
                </div>
              </Col>
              <Col xs lg="3">
                <div className="flex-fill bd-highlight">
                  <span className="text-secondary d-block">
                    Sanciones{" "}
                    {row.deuda_sancion > 0 ? (
                      <span className="text-danger">
                        {formatNumber(row.deuda_sancion)}
                      </span>
                    ) : (
                      formatNumber(row.deuda_sancion)
                    )}
                  </span>
                  <span className="text-secondary d-block">
                    Mantenimientos{" "}
                    {row.deuda_mantenimiento > 0 ? (
                      <span className="text-danger">
                        {formatNumber(row.deuda_mantenimiento)}
                      </span>
                    ) : (
                      formatNumber(row.deuda_mantenimiento)
                    )}
                  </span>
                </div>
              </Col>
              <Col xs lg="3">
                <div className="align-self-end flex-fill bd-highlight">
                  <OverlayTrigger
                    trigger="click"
                    key="right"
                    placement="right"
                    overlay={
                      <Popover id={`popover-positioned-right`}>
                        <Popover.Content>
                          <span className="d-block text-secondary">
                            {`Cuota inicial: `}
                            {formatNumber(row.deuda_inicial)}
                          </span>
                          <span className="d-block text-secondary">
                            {`Cuota extraordinaria: `}
                            {formatNumber(row.deuda_extraordinaria)}
                          </span>
                          <span className="d-block text-secondary">
                            {`Moratorios: `}
                            {formatNumber(row.deuda_moratorio)}
                          </span>
                          <span className="d-block text-secondary">
                            {`Cuota inicial proyecto: `}
                            {formatNumber(row.deuda_inicial_proyecto)}
                          </span>
                          <span className="d-block text-secondary">
                            {`Otras cuotas: `}
                            {formatNumber(row.deuda_cuota)}
                          </span>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <span className="text-secondary cursor-pointer text-underline">
                      Otros{" "}
                      {row.deuda_inicial +
                        row.deuda_extraordinaria +
                        row.deuda_moratorio +
                        row.deuda_inicial_proyecto >
                      0 ? (
                        <span className="text-danger">
                          {formatNumber(
                            row.deuda_inicial +
                              row.deuda_extraordinaria +
                              row.deuda_moratorio +
                              row.deuda_inicial_proyecto +
                              row.deuda_cuota
                          )}
                        </span>
                      ) : (
                        formatNumber(0)
                      )}
                    </span>
                  </OverlayTrigger>

                  <span className="text-secondary d-block">
                    <RiAlarmWarningLine className="mb-2" />
                    Deuda{" "}
                    {row.deuda > 0 ? (
                      <span className="text-danger">
                        {formatNumber(row.deuda)}
                      </span>
                    ) : (
                      formatNumber(row.deuda)
                    )}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12" lg="12">
                {getIconTipoLote(row.tipo_lote)}
                {getIconCatHab(row.category_hab)}
                {getIconSubCatHab(row.sub_category_hab)}
                {getIconCatConst(row.category_const)}
                {getIconSubCatConst(row.category_const)}
                {getIconRecurrente(row.is_recurrente)}
                {getIconHasRepresentante(row.has_representante)}
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <span className="text-secondary d-block">
              <FaUserAlt
                className={`mb-2 ${row.has_representante && "text-info"}`}
              />{" "}
              {row.name === null ? "Sin asociado" : row.name}
            </span>
            <Row>
              <Col>
                <div>
                  <span className="text-secondary d-block">
                    <div className="d-flex justify-content-between">
                      <div>
                        <RiBuilding4Line className="mb-2" /> {row.referencia}
                      </div>
                    </div>
                  </span>
                  <span className="text-secondary d-block">
                    <FaMapMarkedAlt className="mb-2" /> {row.direccion}
                  </span>
                </div>

                <div className="my-3">
                  {row.status === "fusionado" && (
                    <Alert variant="info">
                      Este lote se encuentra fusionado
                    </Alert>
                  )}
                  {row.status === "inactivo" && (
                    <Alert variant="info">
                      Este lote se encuentra inactivo
                    </Alert>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };
  const column = [
    {
      dataField: "id",
      headerStyle: { width: "0px" },
      text: "ID",
      hidden: true,
    },
    {
      dataField: "name",
      text: "",
      formatter: infoGroupLote,
      headerStyle: {
        border: "0px",
      },
      style: {
        border: "0px",
        borderBottom: "1px solid #ebebeb",
      },
    },
    {
      dataField: "",
      isDummyField: true,
      text: "",
      headerAlign: "center",
      align: "center",
      headerStyle: {
        width: "10%",
        border: "0px",
      },
      style: {
        border: "0px",
        borderBottom: "1px solid #ebebeb",
        verticalAlign: "middle",
      },
      formatter: actions,
    },
  ];
  return <TableSearch columns={column} products={items} />;
}

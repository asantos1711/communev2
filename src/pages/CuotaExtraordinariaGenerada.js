import React, { useContext, useState, useEffect } from "react";
import { authContext } from "../context/AuthContext";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import {
  CUOTA_EXTRAORDINARIA_GET,
  CARGO_CUOTA_EXTRAORDINARIA_GET_BY_CUOTA,
} from "../service/Routes";
import { ToastContainer, toast } from "react-toastify";
import MttoGeneradoSkeleton from "../loaders/MttoGeneradoSkeleton";
import { Row, Col, Card } from "react-bootstrap";
import MttoGeneradoStatics from "../components/MttoGeneradoStatics";
import Skeleton from "react-loading-skeleton";
import CuotaExtraordinariaGeneradaNueva from "./CuotaExtraordinariaGeneradaNueva";
import MttoGeneradoList from "../components/MttoGeneradoList";
import CuotaExtrGeneradaList from "../components/CuotaExtrGeneradaList";
import CuotaExtraordinariaSearch from "../components/CuotaExtraordinariaSearch";
import GetAll from "../service/GetAll";
import Get from "../service/Get";
import CuotaExtraordinariaGeneradaNuevaLote from "./CuotaExtraordinariaGeneradaNuevaLote";

export default function CuotaExtraordinariaGenerada() {
  const { auth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [countCondos, setCountCondos] = useState(0);
  const [countHabitacional, setCountHabitacional] = useState(0);
  const [countComercial, setCountComercial] = useState(0);
  const [listByStatus, setListByStatus] = useState([0, 0, 0, 0]);
  const [items, setItems] = useState([]);
  const [isLoadingPie, setLoadingPie] = useState(false);
  const { path, url } = useRouteMatch();

  const [selectOpt, setSelectOpt] = useState([]);
  const [tipo, setTipo] = useState("todos");
  const [selectCuotaExtr, setSelectCuotaExtr] = useState("");

  useEffect(() => {
    Get({ url: CUOTA_EXTRAORDINARIA_GET, access_token: auth.data.access_token })
      .then((response) => {
        //console.log(response)
        setSelectOpt(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log(error)
        toast.error(
          "No se ha podido cargar los tipos de cuota extraordinaria. Intente más tarde",
          { autoClose: 8000 }
        );
      });
  }, []);

  const handleChangeRadio = (e) => {
    setLoadingPie(true);
    setTipo(e.target.value);
    Get({
      url: `${CARGO_CUOTA_EXTRAORDINARIA_GET_BY_CUOTA}/${selectCuotaExtr}/${e.target.value}`,
      access_token: auth.data.access_token,
    })
      .then((response) => {
        //console.log(response)
        setCountCondos(response.data.data.countCondos);
        setCountHabitacional(response.data.data.countHabitacion);
        setCountComercial(response.data.data.countComercio);
        setListByStatus(response.data.data.countByStatus);
        setItems(response.data.data.loteList);
        setLoadingPie(false);
      })
      .catch((error) => {
        toast.error(
          "Ha ocurrido un error. Intente más tarde o contacte con el administrador",
          { autoClose: 8000 }
        );
        setIsLoading(false);
      });
  };

  const onChangeSelect = (e) => {
    setSelectCuotaExtr(e.target.value);

    if (e.target.value === "") {
      setItems([]);
      setCountCondos(0);
      setCountHabitacional(0);
      setCountComercial(0);
      setListByStatus([0, 0, 0, 0]);
    } else {
      setIsLoading(true);
      Get({
        url: `${CARGO_CUOTA_EXTRAORDINARIA_GET_BY_CUOTA}/${e.target.value}/${tipo}`,
        access_token: auth.data.access_token,
      })
        .then((response) => {
          //console.log(response)
          setCountCondos(response.data.data.countCondos);
          setCountHabitacional(response.data.data.countHabitacion);
          setCountComercial(response.data.data.countComercio);
          setListByStatus(response.data.data.countByStatus);
          setItems(response.data.data.loteList);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(
            "Ha ocurrido un error. Intente más tarde o contacte con el administrador",
            { autoClose: 8000 }
          );
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
      <ToastContainer />
      {isLoading ? (
        <MttoGeneradoSkeleton />
      ) : (
        <div>
          <Switch>
            <Route path={path} exact>
              <Row>
                <Col className="mb-4">
                  <CuotaExtraordinariaSearch
                    title="Cuotas extraordinarias generadas"
                    url={url}
                    selectOpt={selectOpt}
                    onChangeSelect={onChangeSelect}
                    selectCuotaExtr={selectCuotaExtr}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="mb-4">
                  <MttoGeneradoStatics
                    isLoadingPie={isLoadingPie}
                    countCondos={countCondos}
                    countHabitacional={countHabitacional}
                    countComercial={countComercial}
                    listByStatus={listByStatus}
                    handleChangeRadio={handleChangeRadio}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="shadow">
                    <Card.Body>
                      <Row>
                        <Col>
                          {isLoadingPie ? (
                            <Skeleton height={391} />
                          ) : (
                            <CuotaExtrGeneradaList items={items} />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Route>
            <Route exact path={`${path}/nuevo`}>
              <CuotaExtraordinariaGeneradaNueva
                access_token={auth.data.access_token}
                selectOpt={selectOpt}
              />
            </Route>
            <Route exact path={`${path}/nuevoporlote`}>
              <CuotaExtraordinariaGeneradaNuevaLote
                access_token={auth.data.access_token}
                selectOpt={selectOpt}
              />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  );
}

import React, { useContext } from "react";
import HeaderNav from "../components/Header";
import FormSearch from "../components/FormSearch";
import { Container } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import Statistics from "./Statistics";
import Administration from "./Administration";
import User from "./User";
import Role from "./Role";
import FooterNav from "../components/FooterNav";
import LoteTypes from "./LoteTypes";
import Habitantes from "./Habitantes";
import Search from "./Search";
import Mantenimiento from "./Mantenimiento";
import Reglas from "./Reglas";
import MantenimientoGenerado from "./MantenimientoGenerado";
import GenerarMulta from "./GenerarMulta";
import TipoMulta from "./TipoMulta";
import PagarMulta from "./PagarMulta";
import EstadoCuentaResidente from "./EstadoCuentaResidente";
import MantenimientoLote from "../components/MantenimientoLote";
import PagoMantenimientoLote from "../components/PagoMantenimientoLote";
import VistaPagoMantenimientoLote from "./VistaPagoMantenimientoLote";
import DeudasResidentes from "./DeudasResidentes";
import Vehiculos from "./Vehiculos";
import TarjetaAcceso from "./TarjetaAcceso";
import Operaciones from "./Operaciones";
import CorteCaja from "./CorteCaja";
import { IsSuperadmin } from "../security/IsSuperadmin";
import { authContext } from "../context/AuthContext";
import Mantenimientos from "./Mantenimientos";
import Reportes from "./Reportes";
import Catalogos from "./Catalogos";
import { IsDirector } from "../security/IsDirector";
import NoMatch from "./NoMatch";
import { IsCobranza } from "../security/IsCobranza";
import { IsAdministrador } from "../security/IsAdministrador";
import TipoNumeroTelefono from "./TipoNumeroTelefono";
import MisPagos from "./MisPagos";
import FacturasIndex from "./FacturasIndex";
import DatosFiscales from "./DatosFiscales";
import MetodoPagoCFDI from "./MetodoPagoCFDI";
import FormaPagoCFDI from "./FormaPagoCFDI";
import UsoCFDI from "./UsoCFDI";
import Cobranza from "./Cobranza";
import CargosRecurrentesIndex from "./CargosRecurrentesIndex";
import ImportarPagos from "./ImportarPagos";
import TIIE from "./TIIE";
import MetodoPago from "./MetodoPago";
import CodigoAutorizacion from "./CodigoAutorizacion";
import Banco from "./Banco";
import SancionesReportes from "./SancionesReportes";
import FacturaGenerada from "./FacturaGenerada";
import TipoComprobante from "./TipoComprobante";
import TipoDocumento from "./TipoDocumento";
import ClaveUnidad from "./ClaveUnidad";
import ClaveProductoServicio from "./ClaveProductoServicio";
import CuotaExtraordinaria from "./CuotaExtraordinaria";
import CuotaInicial from "./CuotaInicial";
import CuotaExtraordinariaGenerada from "./CuotaExtraordinariaGenerada";
import CuotaInicialGenerada from "./CuotaInicialGenerada";
import PagarCuotaInicial from "./PagarCuotaInicial";
import PagarCuotaExtraordinaria from "./PagarCuotaExtraordinaria";
import InteresMoratorios from "./InteresMoratorios";
import Emisor from "./Emisor";
import ControlFactura from "./ControlFactura";
import BitacoraList from "./BitacoraList";
import CorreoCampanas from "./CorreoCampanas";
import MantenimientoVencido from "./MantenimientoVencido";
import FacturaValue from "./FacturaValue";
import FacturaCancelada from "./FacturaCancelada";
import ReceptorDatosFiscales from "./ReceptorDatosFiscales";
import { IsObra } from "../security/IsObra";
import { IsConsultor } from "../security/IsConsultor";
import DatosContacto from "./DatosContacto";
import PagosAtrasados from "./PagosAtrasados";
import CondonarDeuda from "./CondonarDeuda";
import CancelarDeuda from "./CancelarDeuda";
import MantenimientoVencidoConciliacion from "./MantenimientoVencidoConciliacion";
import CuotaInicialProyectoIndex from "./CuotaInicialProyectoIndex";
import PagarCuotaInicialProyecto from "./PagarCuotaInicialProyecto";
import DescuentoEspecial from "./DescuentoEspecial";
import Nota from "./Nota";
import Alerta from "./Alerta";
import GenerarCuota from "./GenerarCuota";
import TipoCuota from "./TipoCuota";
import PagarCuota from "./PagarCuota";
import GenerarPeriodo from "./GenerarPeriodo";
import GenerarFactura from "./GenerarFactura";
import ConfiguracionResidencial from "./ConfiguracionResidencial";
import { isTags } from "../security/isTags";
import RepresentanteLegal from "./RepresentanteLegal";
import CondonarCuota from "./CondonarCuota";
import CancelarCuota from "./CancelarCuota";
import FusionarLotes from "./FusionarLotes";
import InactivarLote from "./InactivarLote";
import TipoCaja from "./TipoCaja";
import CancelarDeudaGlobal from "./CancelarDeudaGlobal";
import Cancelaciones from "./Cancelaciones";
import TipoLote from "./TipoLote";
import TipoMotivoCancelacion from "./TipoMotivoCancelacion";
import TipoRelacionFactura from "./TipoRelacionFactura";
import UserApp from "./UserApp";
import RegimenFiscal from "./RegimenFiscal";
import CarteraVencida from "./CarteraVencida";
import TipoAmenidad from "./amenidades/tipoamenidad/TipoAmenidad";
import AmenidadVerReserva from "./amenidades/agenda/AmenidadVerReserva";
import NewsLetter from "./newsletter/NewsLetter";
import Accesos from "./accesos/Accesos";
import { IsSeguridad } from "../security/IsSeguridad";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import ReglasAmenidad from "./amenidades/reglas/ReglasAmenidad";
import CrearAgenda from "./amenidades/agenda/CrearAgenda";
import VerAgenda from "./amenidades/agenda/VerAgenda";
import EditarAgenda from "./amenidades/agenda/EditarAgenda";
import CrearReserva from "./amenidades/agenda/CrearReserva";
import AccesosEstadisticas from "./accesos/AccesosEstadisticas";
import PlantillasIndex from "./emailtemplate/PlantillasIndex";
import Rondines from "./Rondines";
import Proveedor from "./proveedor/Proveedor";
import Articulo from "./articulo/Articulo";
import OrdenCompra from "./ordencompra/OrdenCompra";
import DescuentoCancelaciones from "./reportes/DescuentoCancelaciones";
import InteresesMoratorios from "./interesesmoratorios/InteresesMoratorios";
import Penalizaciones from "./penalizaciones/Penalizaciones";

export default function Dashboard() {
  const { auth } = useContext(authContext);
  return (
    <>
      <HeaderNav />
      <Container fluid className="mt-3 main-content">
        {!IsSeguridad(auth.data.role) && <FormSearch />}
        <Switch>
          <Route exact path="/">
            {!IsSeguridad(auth.data.role) ? (
              <Statistics />
            ) : (
              <Redirect to="/admin/accesos" />
            )}
          </Route>
          {(IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) && (
            <Route
              path="/admin"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} exact>
                    <Administration auth={auth} />
                  </Route>
                  {IsDirector(auth.data.role) && (
                    <Route path={`${url}/usuario`}>
                      <User />
                    </Route>
                  )}
                  {IsSuperadmin(auth.data.role) && (
                    <Route path={`${url}/role`}>
                      <Role />
                    </Route>
                  )}
                  <Route path={`${url}/mantenimiento`}>
                    <Mantenimiento />
                  </Route>
                  <Route path={`${url}/mantenimientos-generados`}>
                    <MantenimientoGenerado />
                  </Route>
                  <Route path={`${url}/tiie`}>
                    <TIIE />
                  </Route>
                  <Route path={`${url}/cuota-extraordinaria`}>
                    <CuotaExtraordinaria />
                  </Route>
                  <Route path={`${url}/cuota-extraordinaria-generadas`}>
                    <CuotaExtraordinariaGenerada />
                  </Route>
                  <Route path={`${url}/cuota-inicial`}>
                    <CuotaInicial />
                  </Route>
                  <Route path={`${url}/cuota-inicial-generadas`}>
                    <CuotaInicialGenerada />
                  </Route>
                  <Route path={`${url}/intereses-moratorios`}>
                    <InteresMoratorios />
                  </Route>
                  <Route path={`${url}/emisor`}>
                    <Emisor />
                  </Route>
                  <Route path={`${url}/control-factura`}>
                    <ControlFactura />
                  </Route>
                  {IsDirector(auth.data.role) && (
                    <Route path={`${url}/bitacora`}>
                      <BitacoraList />
                    </Route>
                  )}
                  <Route path={`${url}/correo-campanas`}>
                    <CorreoCampanas />
                  </Route>
                  <Route path={`${url}/receptor-datos-fiscales`}>
                    <ReceptorDatosFiscales />
                  </Route>
                  <Route path={`${url}/cuota-inicial-proyecto`}>
                    <CuotaInicialProyectoIndex />
                  </Route>
                  <Route path={`${url}/configuracionresidencial`}>
                    <ConfiguracionResidencial />
                  </Route>
                  <Route path={`${url}/usuarios-app`}>
                    <UserApp />
                  </Route>
                  <Route path={`${url}/reglas-amenidades`}>
                    <ReglasAmenidad />
                  </Route>
                  <Route path={`${url}/crear-agenda`}>
                    <CrearAgenda />
                  </Route>
                  <Route path={`${url}/editar-agenda/:id`}>
                    <EditarAgenda />
                  </Route>
                  <Route path={`${url}/ver-agenda`}>
                    <VerAgenda />
                  </Route>
                  <Route path={`${url}/crear-reserva`}>
                    <CrearReserva />
                  </Route>
                  <Route path={`${url}/amenidades`}>
                    <TipoAmenidad />
                  </Route>
                  <Route path={`${url}/amenidad/ver-reserva`}>
                    <AmenidadVerReserva />
                  </Route>
                  <Route path={`${url}/newsletter`}>
                    <NewsLetter />
                  </Route>
                  <Route path={`${url}/accesos`}>
                    <Accesos />
                  </Route>
                  <Route path={`${url}/accesos/estadisticas`}>
                    <AccesosEstadisticas />
                  </Route>
                  <Route path={`${url}/plantillas`}>
                    <PlantillasIndex />
                  </Route>
                  <Route path={`${url}/rondines`}>
                    <Rondines />
                  </Route>
                  <Route path={`${url}/proveedores`}>
                    <Proveedor />
                  </Route>
                  <Route path={`${url}/articulos`}>
                    <Articulo />
                  </Route>
                  <Route path={`${url}/ordenescompra`}>
                    <OrdenCompra />
                  </Route>
                  <Route path={`${url}/interesesmoratorios`}>
                    <InteresesMoratorios />
                  </Route>
                  <Route path={`${url}/penalizaciones`}>
                    <Penalizaciones />
                  </Route>
                </>
              )}
            />
          )}
          {(IsDirector(auth.data.role) ||
            IsCobranza(auth.data.role) ||
            IsAdministrador(auth.data.role) ||
            isTags(auth.data.role)) && (
            <Route
              path="/operaciones"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} exact>
                    <Operaciones auth={auth} />
                  </Route>
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/lote/:type_lote`}>
                      <LoteTypes />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/habitantes/:tipo`}>
                      <Habitantes />
                    </Route>
                  )}
                  <Route path={`${url}/vehiculos`}>
                    <Vehiculos />
                  </Route>
                  <Route path={`${url}/tarjeta-acceso`}>
                    <TarjetaAcceso />
                  </Route>
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/datos-fiscales`}>
                      <DatosFiscales />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/representantelegal`}>
                      <RepresentanteLegal />
                    </Route>
                  )}
                </>
              )}
            />
          )}

          {(!IsObra(auth.data.role) || !isTags(auth.data.role)) && (
            <Route
              path="/mantenimientos"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} component={Mantenimientos} exact />
                  <Route path={`${url}/generarperiodo`}>
                    <GenerarPeriodo />
                  </Route>
                </>
              )}
            />
          )}
          {(IsDirector(auth.data.role) ||
            IsCobranza(auth.data.role) ||
            IsAdministrador(auth.data.role) ||
            isTags(auth.data.role)) && (
            <Route
              path="/cobranza"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} exact>
                    <Cobranza auth={auth} />
                  </Route>
                  <Route path={`${url}/facturas`}>
                    <FacturasIndex />
                  </Route>
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/generarfactura`}>
                      <GenerarFactura />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/cargos-recurrentes`}>
                      <CargosRecurrentesIndex />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/importar-pagos`}>
                      <ImportarPagos />
                    </Route>
                  )}
                </>
              )}
            />
          )}
          {!IsObra(auth.data.role) && (
            <Route
              path="/reportes"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} exact>
                    <Reportes auth={auth} />
                  </Route>
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/corte-caja`}>
                      <CorteCaja />
                    </Route>
                  )}

                  <Route path={`${url}/sanciones-reportes`}>
                    <SancionesReportes />
                  </Route>

                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/mantenimiento-vencido`}>
                      <MantenimientoVencido />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/mantenimiento-vencido-conciliacion`}>
                      <MantenimientoVencidoConciliacion />
                    </Route>
                  )}

                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/factura-canceladas`}>
                      <FacturaCancelada />
                    </Route>
                  )}

                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/pagos-atrasados`}>
                      <PagosAtrasados />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/cartera-vencida`}>
                      <CarteraVencida />
                    </Route>
                  )}

                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/tipolote`}>
                      <TipoLote />
                    </Route>
                  )}
                  {!isTags(auth.data.role) && (
                    <Route path={`${url}/descuentos-cancelaciones`}>
                      <DescuentoCancelaciones />
                    </Route>
                  )}
                </>
              )}
            />
          )}

          {IsDirector(auth.data.role) && (
            <Route
              path="/catalogos"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} component={Catalogos} exact />
                  <Route path={`${url}/tipo-multa`}>
                    <TipoMulta />
                  </Route>
                  <Route path={`${url}/reglas`}>
                    <Reglas />
                  </Route>
                  <Route path={`${url}/tipo-numero-telefono`}>
                    <TipoNumeroTelefono />
                  </Route>
                  <Route path={`${url}/metodo-pago-cfdi`}>
                    <MetodoPagoCFDI />
                  </Route>
                  <Route path={`${url}/forma-pago-cfdi`}>
                    <FormaPagoCFDI />
                  </Route>
                  <Route path={`${url}/uso-cfdi`}>
                    <UsoCFDI />
                  </Route>
                  <Route path={`${url}/metodo-pago`}>
                    <MetodoPago />
                  </Route>
                  <Route path={`${url}/banco`}>
                    <Banco />
                  </Route>
                  <Route path={`${url}/tipo-comprobante`}>
                    <TipoComprobante />
                  </Route>
                  <Route path={`${url}/tipo-documento`}>
                    <TipoDocumento />
                  </Route>
                  <Route path={`${url}/clave-unidad`}>
                    <ClaveUnidad />
                  </Route>
                  <Route path={`${url}/clave-producto-servicio`}>
                    <ClaveProductoServicio />
                  </Route>
                  <Route path={`${url}/descuento-especial`}>
                    <DescuentoEspecial />
                  </Route>
                  <Route path={`${url}/tipo-cuota`}>
                    <TipoCuota />
                  </Route>
                  <Route path={`${url}/fusionarlotes`}>
                    <FusionarLotes />
                  </Route>
                  <Route path={`${url}/inactivarlote`}>
                    <InactivarLote />
                  </Route>
                  <Route path={`${url}/caja`}>
                    <TipoCaja />
                  </Route>
                  <Route path={`${url}/motivo-cancelacion`}>
                    <TipoMotivoCancelacion />
                  </Route>
                  <Route path={`${url}/relacion-factura`}>
                    <TipoRelacionFactura />
                  </Route>
                  <Route path={`${url}/regimen-fiscal`}>
                    <RegimenFiscal />
                  </Route>
                </>
              )}
            />
          )}
          {(IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) && (
            <Route
              path="/cancelaciones"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} component={Cancelaciones} exact />
                  <Route path={`${url}/cancelardeuda`}>
                    <CancelarDeudaGlobal />
                  </Route>
                </>
              )}
            />
          )}

          {IsSeguridad(auth.data.role) && (
            <Route
              path="/admin"
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/accesos`}>
                    <Accesos />
                  </Route>
                </>
              )}
            />
          )}

          {/*search*/}
          <Route path="/search" component={Search} />

          {/*Codigo de autorizacion*/}
          {!IsObra(auth.data.role) && !IsConsultor(auth.data.role) && (
            <Route path="/codigo-autorizacion" component={CodigoAutorizacion} />
          )}

          {!IsObra(auth.data.role) && !IsConsultor(auth.data.role) && (
            <Route path={`/generar-sancion/:id`}>
              <GenerarMulta />
            </Route>
          )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagar-sancion/:id`}>
                <PagarMulta />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/estado-cuenta/:id`}>
                <EstadoCuentaResidente />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/deudas/:id`}>
                <DeudasResidentes />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagos/:id`}>
                <MisPagos />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/mantenimiento/lote/:id`}>
                <MantenimientoLote />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pago/mantenimiento/:id`}>
                <PagoMantenimientoLote />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/mantenimiento/pagar/lote/:id`}>
                <VistaPagoMantenimientoLote />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/factura-generada/:id`}>
                <FacturaGenerada />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/factura/:id`}>
                <FacturaValue />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagar-cuota-inicial/:id`}>
                <PagarCuotaInicial />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagar-cuota-extraordinaria/:id`}>
                <PagarCuotaExtraordinaria />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/condonar/deuda/:id`}>
                <CondonarDeuda />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/cancelar/deuda/:id`}>
                <CancelarDeuda />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagar-cuota-inicial-proyecto/:id`}>
                <PagarCuotaInicialProyecto />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/nota/:id`}>
                <Nota />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/alerta/:id`}>
                <Alerta />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/generar-cuota/:id`}>
                <GenerarCuota />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/pagar-cuota/:id`}>
                <PagarCuota />
              </Route>
            )}

          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/condonar/cuota/:id`}>
                <CondonarCuota />
              </Route>
            )}
          {!IsObra(auth.data.role) &&
            !IsConsultor(auth.data.role) &&
            !isTags(auth.data.role) && (
              <Route path={`/cancelar/cuota/:id`}>
                <CancelarCuota />
              </Route>
            )}

          <Route path={`/datos-contacto/:id/:idLote`}>
            <DatosContacto />
          </Route>

          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Container>
      <FooterNav />
    </>
  );
}

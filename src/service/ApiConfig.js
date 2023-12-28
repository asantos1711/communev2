import axios from "axios";

const api = {
  rio: "https://api.commune.com.mx/api/v1",
  chetumal: "https://apichetumal.commune.com.mx/api/v1",
  palmaris: "https://apipalmaris.commune.com.mx/api/v1",
  cumbres: "https://apicumbres.commune.com.mx/api/v1",
  viacumbres: "https://apiviacumbres.commune.com.mx/api/v1",
  aqua: "https://apiaqua.commune.com.mx/api/v1",
  arbolada: "https://apiarbolada.commune.com.mx/api/v1",
  test: "http://localhost:9003/api/v1",
  campestre: "https://apicampestre.commune.com.mx/api/v1",
  taina: "https://apitaina.commune.com.mx/api/v1",
  lausana: "https://apilausana.commune.com.mx/api/v1",
  madrid: "https://apimadrid.commune.com.mx/api/v1",
  senderos: "https://apisenderos.commune.com.mx/api/v1",
  senderosnorte: "https://apisenderosnorte.commune.com.mx/api/v1",
  astoria: "https://apiastoria.commune.com.mx/api/v1",
  andara: "https://apiandara.commune.com.mx/api/v1",
  logar: "https://apilogar.commune.com.mx/api/v1",
  longisland: "https://apilongisland.commune.com.mx/api/v1",
  kulkana: "https://apikulkana.commune.com.mx/api/v1",
  ventura: "https://apiventura.commune.com.mx/api/v1",
};

const site = {
  rio: "http://rio.commune.com.mx",
  chetumal: "http://chetumal.commune.com.mx",
  palmaris: "https://palmaris.commune.com.mx",
  cumbres: "https://cumbres.commune.com.mx",
  viacumbres: "http://viacumbres.commune.com.mx",
  aqua: "https://aqua.commune.com.mx",
  arbolada: "https://arbolada.commune.com.mx",
  campestre: "https://campestre.commune.com.mx",
  taina: "https://taina.commune.com.mx",
  lausana: "https://lausana.commune.com.mx",
  madrid: "https://madrid.commune.com.mx",
  senderos: "https://senderos.commune.com.mx",
  senderosnorte: "https://senderosnorte.commune.com.mx",
  astoria: "https://astoria.commune.com.mx",
  andara: "https://andara.commune.com.mx",
  logar: "https://logar.commune.com.mx",
  longisland: "https://longisland.commune.com.mx",
  kulkana: "https://kulkana.commune.com.mx",
  ventura: "https://ventura.commune.com.mx",
};

//test: http://localhost:9001/api/v1

//demo
//https://apimadrid.commune.com.mx/api/v1

//campestre
//https://apicampestre.commune.com.mx/api/v1
//laconquista
//https://apilaconquista.commune.com.mx/api/v1
//laandara
//https://apiandara.commune.com.mx/api/v1
const httpInstance = axios.create({
  baseURL: api.lausana,
});

httpInstance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (error.response.status === 403) {
    window.localStorage.setItem("authData", null);
    window.location.href = site.lausana;
  }
  if (expectedError) {
    //console.log(error.response.status)
    // Loggear mensaje de error a un servicio como Sentry
    // Mostrar error genérico al usuario
    return Promise.reject(error);
  }
});

export default httpInstance;

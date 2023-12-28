import logoChetumal from '../img/logos/logo-chetumal.png'
import logoRio from '../img/logos/logo-rio.png'
import brandLogo from '../img/favico.png'
import logoPalmaris from '../img/logos/logo-palmaris.png'
import logoCumbres from '../img/logos/logo-cumbres.png'
import logoViaCumbres from '../img/logos/logo-viacumbres.png'
import logoAqua from '../img/logos/logo-aqua.png'
import logoArbolada from '../img/logos/logo-arbolada.png'
import logoTaina from '../img/logos/logo-taina.png'
import logoLogar from '../img/logos/logo-logar.png'
import logoLausana from '../img/logos/logo-lausana.png'

export const getLogoResidencial = residencial =>{
    switch(residencial){
        case "CHETUMAL":
            return logoChetumal;
        case "RIO":
            return logoRio;
        case "PALMARIS":
            return logoPalmaris;
        case "CUMBRES":
            return logoCumbres;
        case "VIACUMBRES":
            return logoViaCumbres;
        case "AQUA":
            return logoAqua;
        case "ARBOLADA":
            return logoArbolada;
        case "TAINA":
            return logoTaina;
        case "LOGAR":
            return logoLogar;
        case "LAUSANA":
            return logoLausana;
        default:
            return brandLogo;
    }
}
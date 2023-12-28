export const getCreator = () =>{
    const sistema = process.env.REACT_APP_RESIDENCIAL;

    switch(sistema) {
        case "AQUA":
            return "Residencial Aqua";
        case "ARBOLADA":
            return "Residencial Arbolada";
        case "CHETUMAL":
            return "Residencial Chetumal";
        case "CUMBRES":
            return "Residencial Cumbres";
        case "PALMARIS":
            return "Residencial Palmaris";
        case "RIO":
            return "Residencial Rio";
        case "VIACUMBRES":
            return "Residencial Via Cumbres";
        default:
            return "COMMUNE";
    }
}

import { appToken } from "../constant/token";

export async function enviarNotificacionFirebase(message, token){
    const data = {
        "notification": {"title": "Commune", "body": message},
        "to": token
    }
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${appToken}`
        },
        body: JSON.stringify(data)
    })
    console.log(response)
    return response;
}
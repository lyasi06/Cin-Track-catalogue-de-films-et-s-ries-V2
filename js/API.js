
//URL de l'API
const url = "https://6afae7d2730c1d152f32b5ba.mockapi.io/Cin-Truck";
//Récupère toutes les données depuis l'API.
//Vérifie que la réponse est OK, sinon lève une erreur.
//Retourne le tableau JSON des items.
export async function getTitles() {

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Error API" + response.status);
    }
    const data = await response.json();
    return data;
}

export async function getComments() {
    const response = await fetch(CommentU)
}
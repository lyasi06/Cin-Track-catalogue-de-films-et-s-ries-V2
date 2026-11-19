import {getTitles} from "./API.js";

const url = "https://6afae7d2730c1d152f32b5ba.mockapi.io/Cin-Truck";

async function deleteContent(id) {
    const response = await fetch(url + "/" + id, {method: "DELETE"});

    if(!response.ok){
        throw new Error("Error API" + response.status);
    }
    return response.json();
}

let items = [];


function typeAflam(type){

    if(type === "movie"){
        return "Film";
    }
    return "Serie";
}

function showMessage(text, isError){
    const box = document.querySelector("#message");
    box.textContent = text;
    if(isError){
        box.className = "mb-4 p-4 rounded bg-red-600 text-white";
    }
    else{
        box.className = "mb-4 p-4 rounded bg-green-600 text-white";
    }
}

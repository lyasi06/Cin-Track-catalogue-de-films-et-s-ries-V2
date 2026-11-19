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

function hideMessage(){
    document.querySelector("#message").className = "hidden";
}

function renderTable(list){
    const body = document.querySelector("#tabl-film");
    if(list.length === 0){
        body.innerHTML = `<tr><td> colspan="5" class="p-6 text-center text-slate-400">Aucun titre.</td></tr>`
        return;
    }

    body.innerHTML = list.map(function(item){
        return `<tr class="border-t border-gray-700 text-amber-50 hover:bg-slate-700">
            <td class="p-3">
                <img src="${item.image}" alt="${item.title}" class="w-12 h-16 object-cover rounded">
            </td>
            <td class="p-3 font-semibold">${item.title}</td>
            <td class="p-3">
                <span class="px-2 py-1 text-xs rounded border border-zinc-600">${typeAflam(item.type)}</span>
            </td>
            <td class="p-3 text-slate-300">${item.releaseYear}</td>
            <td class="p-3">
                <div class="flex flex-wrap gap-2">
                    <button class="edit-btn px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm" data-id="${item.id}">Modifier</button>
                    <button class="delete-btn px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm" data-id="${item.id}">Supprimer</button>
                </div>
            </td>
        </tr>`
    }).join("");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function(btn){
        btn.addEventListener("click", function(){
            handeleDelete(btn.dataset.id);
        })
    })
}

async function handeleDelete(id) {
    const item = items.find(function(i){
        return i.id === id;
    });

    if(!confirm("Suprimer " + item.title + "?")){
        return;
    }
    try{
        await deleteContent(id);
        items = items.filter(function(i){
            return i.id !== id;
        })
        renderTable(items);
        showMessage(item.title + "est suprimmer.", false);

    }
    catch(error){
        showMessage("Impossible de suprimmer ce titre. ressayez", true);
        console.log(error.message);
    }
}   

async function loadItems() {

    const loader = document.querySelector("#loader");
    loader.classList.remove("hidden");
    hideMessage();

    try{
        items = await getTitles();
        renderTable(items);
    }catch(error){
        showMessage("Impossible de charger les donnees. Ressayez", true);
        console.log(error.message);
    }
    loader.classList.add("hidden");
}
loadItems();
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
 let messageTimer;
function showMessage(text, isError){
    const box = document.querySelector("#message");
    box.textContent = text;
    if(isError){
        box.className = "mb-4 p-4 rounded bg-red-600 text-white";
    }
    else{
        box.className = "mb-4 p-4 rounded bg-green-600 text-white";
    }
    
    clearTimeout(messageTimer)
        messageTimer = setTimeout(function(){
            hideMessage();
        }, 3000);
}

function hideMessage(){
    document.querySelector("#message").className = "hidden";
}

function renderTable(list){
    const body = document.querySelector("#tabl-film");
    if(list.length === 0){
        body.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">Aucun titre.</td></tr>`
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

let editeId = null;

const form = document.querySelector("#content-form");
const typeSelect = document.querySelector("#type");

function show(){
    document.querySelector("#duration-box").classList.toggle("hidden", typeSelect.value !== "movie");
    document.querySelector("#seasons-box").classList.toggle("hidden", typeSelect.value !== "series");
}
typeSelect.addEventListener("change", show);

function getFormData(){
    return{
        title: document.querySelector("#title").value.trim(),
        type: typeSelect.value,
        releaseYear: Number(document.querySelector("#year").value),
        duration: Number(document.querySelector("#duration").value),
        seasons: Number(document.querySelector("#seasons").value),
        image: document.querySelector("#image").value.trim(),
        genres: document.querySelector("#genres").value.split(",").map(g => g.trim()),
        directors: document.querySelector("#directors").value.split(",").map(g => g.trim()),
        countries: document.querySelector("#countries").value.split(",").map(g => g.trim()),
        description: document.querySelector("#description").value.trim()
    };
}

function isValid(data){
    let ok = true;

    showError("title", "");
    showError("type", "");
    showError("year", "");
    showError("image", "");
    showError("duration", "");
    showError("seasons", "");

    if(data.title === ""){
        showError("title", "Titre obligatoire");
        ok = false;
    }
    if(data.type === ""){
        showError("type", "Choisir un type");
        ok = false;
    }
    if(data.releaseYear < 1900 || data.releaseYear > new Date().getFullYear()){
        showError("year", "Annee invalide");
        ok = false;
    }
    if(data.type === "movie" && data.duration <= 0){
        showError("duration", "Duree invalide");
        ok = false;
    }
    if(!data.image.startsWith("http")){
        showError("image", "URL invalide");
        ok = false;
    }
    if(data.type === "series" && data.seasons <= 0){
        showError("seasons", "Nomber de siasons invalide");
        ok = false;
    }
    return ok;
}

function showError(name, text){
    document.querySelector("#error-" + name).textContent = text;
}

async function createContent(data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    if(!response.ok){
        throw new Error("Error API" + response.status);
    }
    return response.json();
}

async function updateContent(id, data) {
    const response = await fetch(url + "/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if(!response.ok){
        throw new Error("Error API" + response.status);
    }
    return response.json();
}

document.querySelector("#tabl-film").addEventListener("click", function(e){
    if(!e.target.classList.contains("edit-btn")){
        return;
    }
    const item = items.find(function(i){
        return i.id === e.target.dataset.id;
    });
    editeId = item.id;

    document.querySelector("#title").value = item.title;
    typeSelect.value = item.type;
    document.querySelector("#year").value = item.releaseYear;
    document.querySelector("#duration").value = item.duration || "";
    document.querySelector("#seasons").value = item.seasons || "";
    document.querySelector("#image").value = item.image;
    document.querySelector("#genres").value = (item.genres || []).join(", ");
    document.querySelector("#directors").value = (item.directors || []).join(", ")
    document.querySelector("#countries").value = (item.countries || []).join(", ")
    document.querySelector("#description").value = item.description || "";

    show();
    document.querySelector("#form-title").textContent = "Modifier un titre";
    document.querySelector("#submit-btn").textContent = "Enregistrer";
    document.querySelector("#cancel-btn").classList.remove("hidden");
});

function resetForm(){
    form.reset();
    editeId = null;
    show();
    document.querySelector("#form-title").textContent = "Ajouter un titre";
    document.querySelector("#submit-btn").textContent = "Ajouter";
    document.querySelector("#cancel-btn").classList.add("hidden");
}

document.querySelector("#cancel-btn").addEventListener("click", resetForm);

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const data = getFormData();
    if(!isValid(data)){
        return;
    }
    try{
        if(editeId === null){
            const created = await createContent(data);
            items.push(created);
            showMessage("Titre ajoute", false);
        }
        else{
            const item = items.find(function(i){
                return i.id === editeId;
            })
            const updated = {...item, ...data};
            const saved = await updateContent(editeId, updated);
            items = items.map(function(i){
                return i.id === editeId ? saved : i;
            })
            showMessage("Titre modifie", false);
        }
        renderTable(items);
        resetForm();
    }
    catch(error){
        showMessage("Impossible d'enregistrer. Ressayer", true);
        console.log(error.message);
    }
})
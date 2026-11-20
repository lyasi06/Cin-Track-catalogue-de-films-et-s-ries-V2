import {getComments, addComment} from "./API.js";

let comments = [];

function safe(text){
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showComments(list){
    const box = document.querySelector("#comments-list");
    if(list.length === 0){
        box.innerHTML = `<p class="text-zinc-400">Aucun commentaire</p>`;
        return;
    }
    box.innerHTML = list.map(function(c){
        return `<div class="bg-zinc-800 rounded-lg p-3">
        <p class="text-sm">
        <span class="font-bold">${safe(c.author)}</span>
        <span class="text-zinc-400">${c.createdAt ? "• " + new Date(c.createdAt).toLocaleDateString("fr-FR") : ""}</span>
        </p>
        <p class="mt-1 text-zinc-300">${safe(c.text)}</p>
        </div>`;
    }).join("");
}

export async function loadComment(item) {
    const loader = document.querySelector("#comments-loader");
    loader.classList.remove("hidden");
    try{
        const all = await getComments();
        comments = all.filter(function(c){
            return c.contentId === item.id;
        });
        showComments(comments);
    }catch(error){
        document.querySelector("#comments-list").innerHTML = 
        `<p class="text-red-400">Impossible de charger les commentaires.</p>`;
        console.log(error.message);
    }
    loader.classList.add("hidden");
}

export function setupCommentsForm(item){
    const form = document.querySelector("#comment-form");
    const authorInput = document.querySelector("#comment-author");
    authorInput.value = localStorage.getItem("pseudo") || "";

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const author = authorInput.value.trim();
        const text = document.querySelector("#comment-text").value.trim();

        document.querySelector("#error-author").textContent = "";
        document.querySelector("#error-text").textContent = "";

        let ok = true;

        if(author === ""){
            document.querySelector("#error-author").textContent = "Nom obligatoire";
            ok = false;
        }
        if(text === ""){
            document.querySelector("#error-text").textContent = "Commentair obligatoire";
            ok = false;
        }
        if(!ok){
            return;
        }
        try{
            const created = await addComment({
                contentId: item.id,
                author: author,
                text: text,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem("pseudo", author);
            comments.push(created);
            showComments(comments);
            document.querySelector("#comment-text").value = "";

        }catch(error){
            document.querySelector("#error-text").textContent = "Impossible de publier. Ressayez";
            console.log(error.message);
        }
    })
}

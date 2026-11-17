// ─────────────────────────────────────────────────────────────
// FICHIER TEMPORAIRE : import.js
// RÔLE : Copie les données du fichier JSON statique
//        vers MockAPI. À exécuter UNE SEULE FOIS.
//        (Ne pas importer dans main.js)
// ─────────────────────────────────────────────────────────────

const MOCK_API_URL = "https://6afae7d2730c1d152f32b5ba.mockapi.io/Cin-Truck";
const DATA_URL = "https://raw.githubusercontent.com/ouchad97/cinetrack-api/main/cinetrack-data.json";

async function importData() {
  try {
    const res = await fetch(DATA_URL);
    const items = await res.json();
    
    for (const item of items) {
      const { id, ...data } = item; 
      const response = await fetch(MOCK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur sur " + item.title);
      console.log("Ajouté :", item.title);
    }

    console.log("Import terminé :", items.length, "titres");
  } catch (error) {
    console.error(error.message);
  }
}

importData();
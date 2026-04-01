
// Data, která uživatel zadal do políček na webu
const zadanaData = {
    cislo: 100 // Tady načtete hodnotu z inputu, např. document.getElementById('moje-cislo').value
};

// Zeptáme se našeho Netlify sejfu
async function ziskejVysledek() {
    try {
        const response = await fetch('/.netlify/functions/vypocet', {
            method: 'POST',
            body: JSON.stringify(zadanaData)
        });

        // Tady si převezmeme hotový výsledek ze serveru
        const data = await response.json();
        
        // Zobrazení výsledku uživateli
        console.log("Výsledek z tajného sejfu je:", data.vysledek);
        // např. document.getElementById('vysledek').innerText = data.vysledek;

    } catch (error) {
        console.error("Chyba při komunikaci se sejfem:", error);
    }
}

ziskejVysledek();

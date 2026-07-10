import test from "node:test";
import assert from "node:assert/strict";

// Questa è la regola di business che devo proteggere
//Nello unit testing isoliamo la funzione pura.
//In questo modo possiamo passargli dei dati finti 
//e vedere se risponde esattamente come indicato nella tabella del professore,
// senza dover avviare il server o usare il browser

function computeUrgencyLabel(priority, sourceChannel) {
    if (priority === "bassa") return "monitorare";
    if (priority === "alta") {
        if (sourceChannel === "telefono") return "intervento rapido";
        return "prioritario";
    }
    if (priority === "normale") {
        if (sourceChannel === "email") return "standard";
        return "da gestire";
    }
    return "standard";
}

// TEST 1: Verifica che alta + telefono dia il risultato sperato
test("alta + telefono diventa intervento rapido", () => {
    const label = computeUrgencyLabel("alta", "telefono");
    assert.equal(label, "intervento rapido");
});
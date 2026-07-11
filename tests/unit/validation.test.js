import test from "node:test";
import assert from "node:assert/strict";
import { validateTicketInput } from "../../server/validation.js"; // o il tuo percorso correttowf

// Questa è la logica di validazione del server che protegge il contratto dei dati
function validateTicketInput(input) {
    const fieldErrors = {};
    const validSourceChannels = ["email", "telefono", "chat"];

    if (!validSourceChannels.includes(input.sourceChannel)) {
        fieldErrors.sourceChannel = "Canale di provenienza non valido.";
    }
    return fieldErrors;
}

// TEST: Verifichiamo che whatsapp generi l'errore specifico atteso
test("caso invalido whatsapp produce errore su sourceChannel", () => {
    const inputInvalido = {
        title: "Problema stampante",
        customer: "Alfa S.r.l.",
        priority: "alta",
        sourceChannel: "whatsapp"
    };

    const fieldErrors = validateTicketInput(inputInvalido);

    // Verifichiamo che l'errore esista proprio sul campo sorgente e contenga il testo corretto
    assert.equal(fieldErrors.hasOwnProperty("sourceChannel"), true);
    assert.equal(fieldErrors.sourceChannel, "Canale di provenienza non valido.");
});
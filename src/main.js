const form = document.querySelector("#ticket-form");
const ticketTableBody = document.querySelector("#ticket-table-body");
const ticketCount = document.querySelector("#ticket-count");
const formStatus = document.querySelector("#form-status");
const emptyPanel = document.querySelector("#empty-panel");
const payloadPreview = document.querySelector("#payload-preview");
const responsePreview = document.querySelector("#response-preview");
const reloadButton = document.querySelector("#reload-button");
const serverFieldPreview = document.querySelector("#server-field-preview");

function getFormPayload() {
  const data = new FormData(form);

  return {
    title: String(data.get("title") || "").trim(),
    customer: String(data.get("customer") || "").trim(),
    description: String(data.get("description") || "").trim(),
    priority: String(data.get("priority") || ""),
    sourceChannel: String(data.get("sourceChannel") || "")
  };
}

function updatePayloadPreview() {
  payloadPreview.textContent = JSON.stringify(getFormPayload(), null, 2);
  serverFieldPreview.textContent = "urgencyLabel: da calcolare";
}

function setStatus(message, type = "neutral") {
  formStatus.textContent = message;
  formStatus.dataset.type = type;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTickets(tickets) {
  ticketCount.textContent = String(tickets.length);
  emptyPanel.hidden = tickets.length !== 0;

  ticketTableBody.innerHTML = tickets
    .map(
      (ticket) => `
        <tr>
          <td><strong class="ticket-id">#${escapeHtml(ticket.id)}</strong></td>
          <td>${escapeHtml(ticket.title)}</td>
          <td>${escapeHtml(ticket.customer)}</td>
          <td><span class="pill priority-${escapeHtml(ticket.priority)}">${escapeHtml(ticket.priority)}</span></td>
          <td>${escapeHtml(ticket.sourceChannel)}</td>
          <td><span class="server-value ${ticket.urgencyLabel ? "is-ready" : ""}">${escapeHtml(ticket.urgencyLabel || "da calcolare")}</span></td>
          <td>
            <span class="status-pill">${escapeHtml(ticket.status)}</span>
            <small>${formatDate(ticket.createdAt)}</small>
          </td>
        </tr>
      `
    )
    .join("");
}

async function loadTickets() {
  setStatus("Caricamento ticket...", "loading");

  const response = await fetch("/api/tickets");
  const payload = await response.json();

  responsePreview.textContent = JSON.stringify(payload, null, 2);
  renderTickets(payload.tickets);
  setStatus("Ticket caricati.", "success");
}

async function createTicket(payload) {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responsePayload = await response.json();
  responsePreview.textContent = JSON.stringify(responsePayload, null, 2);

  if (!response.ok) {
    const firstError = Object.values(responsePayload.fieldErrors || {})[0];
    throw new Error(firstError || responsePayload.message || "Errore salvataggio ticket.");
  }

  return responsePayload.ticket;
}

form.addEventListener("input", updatePayloadPreview);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getFormPayload();
  payloadPreview.textContent = JSON.stringify(payload, null, 2);

  setStatus("Salvataggio in corso...", "loading");

  try {
    const ticket = await createTicket(payload);

    form.reset();
    updatePayloadPreview();
    serverFieldPreview.textContent = ticket.urgencyLabel
      ? `urgencyLabel: ${ticket.urgencyLabel}`
      : "urgencyLabel: non calcolato";
    await loadTickets();

    setStatus(`Ticket ${ticket.id} creato.`, "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Errore imprevisto.", "error");
  }
});

reloadButton.addEventListener("click", () => {
  loadTickets().catch((error) => {
    setStatus(error instanceof Error ? error.message : "Errore caricamento ticket.", "error");
  });
});

updatePayloadPreview();
loadTickets().catch((error) => {
  setStatus(error instanceof Error ? error.message : "Errore caricamento ticket.", "error");
});

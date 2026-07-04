# Payload Cases - L11

> Compilato a posteriori dopo il lab L12. I casi sono stati effettivamente
> verificati via `curl` e via UI (form).

## Caso Valido

```json
{
  "title": "Impossibile accedere al portale",
  "customer": "Acme Srl",
  "description": "Login bloccato su account admin",
  "priority": "alta",
  "sourceChannel": "telefono"
}
```

Expected:

```txt
201
urgencyLabel=intervento rapido
```

Verificato: `POST /api/tickets` -> 201 con body
`{"ticket":{...,"urgencyLabel":"intervento rapido",...}}`.

## Caso Invalido 1

Input:

```json
{
  "title": "Test priorita non valida",
  "customer": "Acme Srl",
  "description": "x",
  "priority": "immediata",
  "sourceChannel": "telefono"
}
```

Expected:

```txt
400
fieldErrors.priority
```

Verificato: `validateTicketInput` in `server/index.js:104-106` rifiuta
priorita' fuori da `["bassa","normale","alta"]`.

## Caso Invalido 2

Input:

```json
{
  "title": "Test canale non valido",
  "customer": "Acme Srl",
  "description": "x",
  "priority": "alta",
  "sourceChannel": "whatsapp"
}
```

Expected:

```txt
400
fieldErrors.sourceChannel
```

> **Nota**: il template L11 usava `fax` come esempio di sourceChannel invalido.
> Il materiale canonico L12 (`AGENTS.md`, `README.md`, `consegna.md`) richiede
> esplicitamente `whatsapp`. Il check e' equivalente (entrambi fuori da
> `validSourceChannels`) ma il laboratorio si aspetta `whatsapp` come caso
> canonico dimostrativo.

Verificato: `validateTicketInput` in `server/index.js:108-110` produce
`fieldErrors.sourceChannel = "Canale non valido."`.

## Non Autenticato

Expected:

```txt
401
```

**Fuori scope L12**: l'autenticazione non e' implementata (vedi
`AGENTS.md:49`, `README.md:95-96`). La riga e' lasciata come forward-planning
per una lezione futura.

## File Candidati Per L12

| File | Perche' |
| --- | --- |
| `server/index.js` | `computeUrgencyLabel` (riga 84), `validateTicketInput` (riga 93), `createTicket` (riga 136), `listTickets` (riga 115), rotte `/api/tickets` (righe 247, 252). |
| `src/main.js` | Raccoglie il payload dal form (riga 11-21), chiama POST `/api/tickets` (riga 78), renderizza la label in tabella (riga 55). |
| `index.html` | Definisce i campi del form (radio `priority` riga 73-75, radio `sourceChannel` riga 82-84) e la colonna "Urgency label" in tabella (riga 124). |
| `src/styles.css` | Stile dark dashboard + classe `.server-value.is-ready` per la cella con label valorizzata. |

## Confine Client/Server

Campi da non accettare dal client:

- `urgencyLabel` (calcolato server-side, ignorato se presente nel body)
- `createdByOperatorId` (non presente nel progetto L12)

Motivo:

```txt
Sono dati decisi dal server.

`urgencyLabel` deriva da una regola di prodotto che il client non deve
conoscere; accettarlo dal client aprirebbe la porta a spoofing.
`createdByOperatorId` non e' in scope per L12 (introdotto solo nel demo
docente `responseDueAt`).
```

Verifica: `normalizeTicketInput` in `server/index.js:208-216` estrae
esplicitamente solo `title`, `customer`, `description`, `priority`,
`sourceChannel`. Qualunque altro campo viene scartato.

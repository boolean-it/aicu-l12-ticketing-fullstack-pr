# Request Trace - L11

> Compilato a posteriori dopo il lab L12. Lo stack di L12 usa `node:sqlite`
> (built-in), non Prisma: i riferimenti "Prisma" del template originale sono
> adattati di conseguenza.

## Feature Studenti

```txt
priority + sourceChannel -> urgencyLabel
```

## Trace

| Step | Cosa entra | Cosa decide il server | Errore possibile | Evidenza attesa |
| --- | --- | --- | --- | --- |
| request | `POST /api/tickets` con body JSON `{title, customer, description, priority, sourceChannel}` | Routing: solo metodo POST + path esatto | 404 se path diverso, 405 se metodo diverso | Log server, network panel |
| validation | Body JSON parsato | `normalizeTicketInput` (stringify + trim) e poi `validateTicketInput`: `title` >= 3 char, `customer` >= 2 char, `priority` in {bassa, normale, alta}, `sourceChannel` in {email, telefono, chat} | 400 con `fieldErrors.{campo}` se qualche check fallisce | Response body `{message, fieldErrors}` |
| auth/session | (nessuno, route pubblica) | Nessun controllo | Non applicabile (fuori scope L12) | - |
| rule | `priority`, `sourceChannel` validati | `computeUrgencyLabel(priority, sourceChannel)` mappa 3x3; `?? null` come fallback difensivo | Solo se validation fallisce, ma a quel punto la rule non viene chiamata | `urgencyLabel` valorizzato o `null` |
| persistenza (SQLite) | Tutti i campi normalizzati + `urgencyLabel` calcolato + `id` generato + `createdAt` ISO | INSERT in `tickets` (colonna `urgency_label`); poi SELECT della riga appena inserita per restituire l'oggetto completo con alias camelCase | 500 con `{message, detail}` su errore DB (es. disco pieno) | Response 201 con `{ticket}` |
| response | Ticket persistito | Invio JSON con `urgencyLabel` calcolato oppure errore di validation | - | 201 o 400 |

## Caso Valido

```txt
priority=alta
sourceChannel=telefono
expected urgencyLabel=intervento rapido
```

Verifica curl (eseguita):

```txt
POST /api/tickets
{"title":"...","customer":"...","description":"x","priority":"alta","sourceChannel":"telefono"}
-> 201
{"ticket":{"id":"TCK-...","priority":"alta","sourceChannel":"telefono","urgencyLabel":"intervento rapido",...}}
```

## Caso Invalido

```txt
field=sourceChannel
value=whatsapp
expected error=400 fieldErrors.sourceChannel
```

Verifica curl (eseguita):

```txt
POST /api/tickets
{"...","priority":"alta","sourceChannel":"whatsapp"}
-> 400
{"message":"Controlla i campi del ticket.","fieldErrors":{"sourceChannel":"Canale non valido."}}
```

## File Candidati

| Area | File candidato | Perche' |
| --- | --- | --- |
| UI payload | `src/main.js` (`getFormPayload`, riga 11) | Costruisce l'oggetto mandato al server, incluso `sourceChannel`. |
| API route | `server/index.js` (righe 247-266) | Dispatch `GET`/`POST /api/tickets`. |
| validation | `server/index.js` (`validateTicketInput`, riga 93) | 4 check: title, customer, priority, sourceChannel. |
| rule | `server/index.js` (`computeUrgencyLabel`, riga 84) | Mappa annidata 3x3, single source of truth. |
| schema | `server/index.js` (riga 20) + `data/tickets.sqlite` | `CREATE TABLE IF NOT EXISTS tickets` con colonna `urgency_label TEXT`. |
| lista/card | `src/main.js` (`renderTickets`, riga 42) + `index.html` (riga 116-130) | Tabella con cella "Urgency label" che mostra `urgencyLabel` server-side. |

## Fuori Scope

- `responseDueAt` (campo demo docente, mai persistito)
- duplicate ticket detection
- notifiche
- assegnazioni
- filtri avanzati sulla lista
- dashboard analytics / contatori per priorita'
- autenticazione reale (la riga `auth/session` del trace resta vuota)
- suite di test completa
- backfill dei ticket seed esistenti con `urgency_label = null` (la UI li
  mostra come "da calcolare", coerente)

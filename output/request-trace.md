# Request Trace - L11

## Feature Studenti

```txt
priority + sourceChannel -> urgencyLabel
```

## Trace

| Step | Cosa entra | Cosa decide il server | Errore possibile | Evidenza attesa |
| --- | --- | --- | --- | --- |
| request | `POST /api/tickets` con body `{title, customer, description, priority, sourceChannel}` | Legge e normalizza il body (`normalizeTicketInput`) | Body malformato / JSON non valido | Eccezione catturata -> 500 con `message` |
| validation | Input normalizzato | Valida `title`, `customer`, `priority` (contro `validPriorities`) e `sourceChannel` (contro `validSourceChannels`) | Campo mancante o non valido | 400 con `fieldErrors.<campo>` |
| auth/session | Nessuna sessione richiesta in questo lab | Nessun controllo (auth reale fuori scope) | n/a | n/a |
| rule | `priority` + `sourceChannel` gia' validati | `computeUrgencyLabel(priority, sourceChannel)` calcola `urgencyLabel` secondo la tabella a 9 combinazioni | Nessuno, tutte le combinazioni valide sono coperte dal mapping | `urgencyLabel` valorizzato prima dell'insert |
| SQLite | Riga ticket completa (incluso `urgencyLabel`) | Persistenza via `node:sqlite` | Vincoli NOT NULL/PK falliti | Riga salvata |
| response | Ticket appena creato, riletto dal DB | Restituisce `201` con `{ ticket }`, `urgencyLabel` incluso | Eccezione DB non gestita -> 500 | Body JSON con `ticket.urgencyLabel` valorizzato |

## Caso Valido

```txt
priority=alta
sourceChannel=telefono
expected urgencyLabel=intervento rapido
```SQLite
SQLite
## Caso Invalido

```txt
field=sourceChannel
value=whatsapp
expected error=400 fieldErrors.sourceChannel
```

## File Candidati

| Area | File candidato | Perche' |
| --- | --- | --- |
| UI payload | `src/main.js` (`getFormPayload`) | Già include `sourceChannel` nel payload inviato, nessuna modifica necessaria |
| API route | `server/index.js` (handler `POST /api/tickets`) | Punto in cui si concatenano validazione, calcolo regola e creazione ticket |
| validation | `server/index.js` (`validateTicketInput`) | Manca il controllo su `sourceChannel` rispetto a `validSourceChannels`. |
| rule | `server/index.js` (`computeUrgencyLabel`) | Stub che ritorna `null`, da implementare con la tabella mapping |
| SQLite/Schema | `server/index.js` (`CREATE TABLE tickets`, colonna `urgency_label`) | Schema SQLite già pronto, la colonna esiste già |
| lista/card | `src/main.js` (`renderTickets`) + `index.html` (colonna "Urgency label") | Già mostrano `urgencyLabel` |

## Fuori Scope

- `responseDueAt`
- Notifiche
- Assegnazioni
- Filtri avanzati
- Autenticazione reale
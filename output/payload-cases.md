# Payload Cases - L11

## Caso Valido

```json
{
  "title": "Impossibile accedere al portale clienti",
  "customer": "Alfa S.r.l.",
  "description": "Errore login su account amministrativo",
  "priority": "alta",
  "sourceChannel": "telefono"
}
```

Expected:

```txt
201
urgencyLabel=intervento rapido
```

## Caso Invalido 1

Input:

```json
{
  "title": "Impossibile accedere al portale clienti",
  "customer": "Alfa S.r.l.",
  "priority": "immediata",
  "sourceChannel": "telefono"
}
```
SQLite
Expected:

```txt
400
fieldErrors.priority
```

## Caso Invalido 2

Input:

```json
{
  "title": "Impossibile accedere al portale clienti",
  "customer": "Alfa S.r.l.",
  "priority": "alta",
  "sourceChannel": "whatsapp"
}
```

Expected:

```txt
400
fieldErrors.sourceChannel
```

## Non Autenticato (?)

Expected:

```txt
401
```

Il progetto non implementa autenticazione reale

## File Candidati Per L12

| File | Perche' |
| --- | --- |
| `server/index.js` | Contiene `computeUrgencyLabel()` e `validateTicketInput()` (manca il controllo su `sourceChannel` con `validSourceChannels`) |
| `src/main.js` | Già invia `sourceChannel` nel payload e mostra `urgencyLabel` in tabella |
| `index.html` | Il form già raccoglie `sourceChannel` |
| `data/` | Contiene il DB SQLite generato in automatico, non va modificato |

## Confine Client/Server

Campi da non accettare dal client:

- `urgencyLabel`
- `createdByOperatorId`

Motivo:

```txt
Sono dati decisi dal server.
```

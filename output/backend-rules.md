# Backend Rules - L11

## Valori Validi

### Priority

- bassa
- normale
- alta

### Source Channel

- email
- telefono
- chat

Valore non valido da provare: `whatsapp` -> deve produrre `fieldErrors.sourceChannel`

## Mapping

| Priority | Source Channel | Urgency Label |
| --- | --- | --- |
| alta | telefono | intervento rapido |
| alta | chat | prioritario |
| alta | email | prioritario |
| normale | telefono | da gestire |
| normale | chat | da gestire |
| normale | email | standard |
| bassa | telefono | monitorare |
| bassa | chat | monitorare |
| bassa | email | monitorare |

## Dati Decisi Dal Server

- `urgencyLabel`: calcolato da `computeUrgencyLabel(priority, sourceChannel)`, mai accettato dal client
- `createdByOperatorId`: non esiste auth reale (fuori scope)
- eventuali default: `id` (es. `TCK-10482`, generato server-side), `status` (default `"aperto"`), `createdAt` (timestamp generato server-side)

## Dati Inviati Dal Client

- `title`: stringa, minimo 3 caratteri.
- `customer`: stringa, minimo 2 caratteri.
- `description`: stringa, opzionale (default stringa vuota).
- `priority`: uno tra `bassa` | `normale` | `alta`.
- `sourceChannel`: uno tra `email` | `telefono` | `chat`.

## Fuori Scope

- `responseDueAt`
- Notifiche
- Assegnazioni
- Filtri avanzati
- Autenticazione reale

## Regola In Forma Di Funzione

```txt
computeUrgencyLabel(priority, sourceChannel) -> urgencyLabel
```

Non duplicare questa regola nel client
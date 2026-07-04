# Backend Rules - L11

> Compilato a posteriori dopo il lab L12. Le specifiche effettive sono in
> `AGENTS.md`, `README.md` e `consegna.md` di L12.

## Valori Validi

### Priority

- `bassa`
- `normale`
- `alta`

### Source Channel

- `email`
- `telefono`
- `chat`

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

> **Nota divergenza L11 -> L12**: il mapping "consigliato" di L11 copriva solo
> 4 combinazioni (`alta+telefono`, `alta+email`, `normale+chat`, `bassa+qualunque`).
> L12 estende la regola a tutte le 9 combinazioni della matrice 3 priority x
> 3 sourceChannel. In particolare:
> - `alta + chat -> prioritario` (non coperto da L11)
> - `normale + telefono -> da gestire` e `normale + chat -> da gestire`
>   (L11 suggeriva "standard" per `normale+chat`, sovrascritto in L12)
>
> Fonte canonica L12: `server/index.js:84-91`.

## Dati Decisi Dal Server

- `urgencyLabel`: calcolato dalla regola `computeUrgencyLabel(priority, sourceChannel)`;
  persistito nella colonna `urgency_label TEXT` (puo' essere `null` per record
  creati prima del deploy della regola).
- `id`: generato come `TCK-${5 cifre random}` in `server/index.js:137`.
- `status`: default `'aperto'`.
- `createdAt`: timestamp ISO generato server-side.
- `createdByOperatorId`: non implementato in L12 (campo del demo docente
  `responseDueAt`, fuori scope).

## Dati Inviati Dal Client

- `title`
- `customer`
- `description`
- `priority`
- `sourceChannel`

## Fuori Scope

- `responseDueAt`
- duplicate ticket detection
- notifiche
- assegnazioni
- filtri avanzati
- dashboard analytics
- auth reale / session
- suite di test completa

## Regola In Forma Di Funzione

```txt
computeUrgencyLabel(priority, sourceChannel) -> urgencyLabel
```

Implementazione: `server/index.js:84-91`. Mappa annidata per priorita',
`?? null` come fallback difensivo (la validazione a monte esclude comunque
valori fuori dominio).

Non duplicare questa regola nel client. `src/main.js` mostra solo il valore
restituito dall'API.

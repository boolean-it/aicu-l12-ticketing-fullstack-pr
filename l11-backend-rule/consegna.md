# Consegna Studenti - Lezione 11

## Prima Di Compilare

Questa e' una preparazione al lab L12.

Non devi implementare `urgencyLabel` ora. Devi preparare regole e casi per poter lavorare in modo ordinato nel lab.

Artefatti:

- mapping backend;
- payload cases;
- request trace;
- file candidati.

Errore tipico da evitare: scrivere codice prima di sapere quali input sono validi e quale output deve produrre il server.

## Input

- Transfer checklist L10 o fallback UI.
- Demo docente `responseDueAt`.
- Template in `studenti/template/`.

## Passaggi Per Risolvere L'Esercizio

1. Definisci i valori validi di `priority`.
2. Definisci i valori validi di `sourceChannel`.
3. Scrivi il mapping `priority + sourceChannel -> urgencyLabel`.
4. Scrivi un payload valido.
5. Scrivi almeno due payload invalidi.
6. Compila il trace `request -> validation -> rule -> Prisma -> response`.
7. Indica quali file pensi di toccare in L12.
8. Scrivi cosa resta fuori scope.

## Mapping Consigliato

```txt
alta + telefono -> intervento rapido
alta + email -> prioritario
normale + chat -> standard
bassa + qualunque sourceChannel -> monitorare
```

## Output Atteso

- `backend-rules.md` compilato o nota equivalente.
- `payload-cases.md` compilato o nota equivalente.
- `request-trace.md` compilato o nota equivalente.
- Nessuna patch obbligatoria.

## Fuori Scope

- Implementazione.
- Test automatici.
- Timezone o SLA.
- Dashboard o assegnazioni.

## Pronto Quando

Sei pronto per L12 quando puoi dire:

```txt
Questi input sono validi.
Questi input sono invalidi.
Questa e' la label attesa.
Questo e' il trace server-side.
Questi sono i file candidati.
Queste cose non le faccio nel lab.
```

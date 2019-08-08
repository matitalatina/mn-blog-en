---
layout: post
title: Come programmare in Test-Driven Development (TDD) partendo da zero
description: In questa guida scopriamo insieme come sviluppare in TDD e quali benefici porta al nostro codice.
image: img/tdd/coding-man.jpg
author: Mattia Natali
date: 2018-12-28T07:03:47.149Z
tags: 
  - Dev
  - How-to
  - Getting Started
  - Testing
  - TDD
  - TypeScript
---

TDD di qui, TDD di là, tutti ne parlano. Molti ne elogiano i pregi, altri dicono che è una perdita di tempo... Ma alla fine come si procede a sviluppare in TDD?

In questa guida potrai vedere un esempio reale sviluppato in [Test-Driven Development](https://it.wikipedia.org/wiki/Test_driven_development). Questa tecnica di programmazione la sto adottando da oltre un anno per i backend che sviluppo in Java, Python e TypeScript. I benefici nel codice che ho scritto sono visibili e molti. Spero di riuscire a convincerti che questa tecnica:

- Migliora la qualità del codice.
- Diminuisce il tempo speso in debugging e la ricerca di eventuali regressioni del software.
- Diminuisce il numero di bug che riescono a raggiungere la produzione.
- Semplifica lo sviluppo di applicativi complessi.
- È più semplice di quanto sembri.

Come posso convincerti di tutte queste cose? Spero di farcela attraverso un **esempio pratico partendo completamente da zero**.

## Obiettivo

In questa guida svilupperemo una classe che prende in input un'URL e una parola da cercare nella pagina che abbiamo inserito.
In questa ricerca ci risponderà dicendo quante volte ha trovato la parola.

Faremo questo semplice applicativo in [Node.Js](https://nodejs.org/it/) + [TypeScript](https://www.typescriptlang.org/), interamente in TDD.
Durante questo sviluppo spiegherò tutti i passaggi e espliciterò tutti i vantaggi che sta introducendo il TDD.

## Prerequisiti

Per seguire la guida dovresti avere:

- Installato Node.js.
- Un minimo di esperienza con Node.js. TypeScript, se non lo hai mai usato, è JavaScript con i tipi, per ora è tutto quello che devi sapere.
- Per la seconda parte c'è bisogno di sapere il concetto di programmazione asincrona in JavaScript: andremo ad utilizzare le [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) e le keyword [async e await](https://javascript.info/async-await).
- Un sistema UNIX (Linux o Mac). Oppure aver abilitato il [WSL su Windows](http://wsl-guide.org/en/latest/).

Se per caso ti stai perdendo, [in questa repo su GitHub](https://github.com/matitalatina/word-counter) puoi trovare il prodotto finito. Ma ti consiglio di non "sbirciare" la soluzione perché introdurremo molti concetti nel corso dell'articolo. Vedere il progetto finito senza sapere *come* ci siamo arrivati non apporta alcun beneficio nell'apprendimento.

## Creazione del progetto

Il primo passo è ovviamente creare il progetto. Per questo apriamo il *terminale* in una cartella su cui lavoreremo. La mia cartella si chiamerà `word-counter`.

```bash
mkdir word-counter
cd word-counter
```

Creiamo il file `package.json` dove inseriremo le varie dipendenze Node.js e gli scripts.

```bash
npm init
```

Inseriamo i vari dati che ci chiede. Per ora possiamo anche solo premere `Enter` e mantenere i valori di default.

## Aggiunta delle dipendenze

Ora possiamo inserire il minimo indispensabile per poter iniziare a sviluppare in TDD. Le dipendenze che ci servono sono:

- [TypeScript](https://www.typescriptlang.org/): per sviluppare con questo linguaggio.
- [TSLint](https://palantir.github.io/tslint/): il [linter](https://en.wikipedia.org/wiki/Lint_(software)) di TypeScript che ci aiuterà nello sviluppo per scrivere codice pulito. Questo è opzionale, ma io solitamente lo aggiungo sempre per avere un ottimo aiuto durante lo sviluppo. Inoltre è integrato molto bene con [Visual Studio Code](https://code.visualstudio.com/), che è il mio Text Editor preferito per quanto riguarda il mondo Node.js.
- [Jest](https://jestjs.io/): la nostra piattaforma di testing.

Per installare tutto questo scriviamo

```bash
npm install --save-dev typescript tslint jest ts-jest @types/jest
```

Possiamo verificare che in `package.json` sono state aggiunte queste cinque dipendenze in `devDependencies`, ossia sono dipendenze che servono per lo sviluppo e non al programma vero e proprio. Inoltre possiamo notare che queste dipendenze sono state scaricare nella cartella `node_modules`.

Il comando dovrebbe essere chiaro, l'unica parte che forse ha bisogno di spiegazione sono le librerie per Jest. Infatti abbiamo installato tre dipendenze per far girar il tutto.

- `jest` è la nostra piattaforma di testing.
- `ts-jest` è il transpilatore che transforma TypeScript in JavaScript prima di far girare i test. Senza di esso dovremmo ogni volta [transpilare](https://it.quora.com/Qual-%C3%A8-la-differenza-tra-la-transpilazione-e-la-compilazione-nella-programmazione-per-computer) manualmente il codice, cosa che vogliamo assolutamente evitare per non perdere tempo.
- `@types/jest` serve a TypeScript per sapere i tipi che sono dentro la libreria di Jest. Immagina che molte volte le librerie sono scritte in JavaScript, quindi TypeScript non avrebbe idea di cosa le funzioni accettano in input o restituiscono in output. Fortunatamente ci sono degli sviluppatori che creano delle librerie che mappano le funzioni JavaScript in TypeScript. Solitamente per installare questi mapping si installa la dipendenza `@types/<LIBRERIA_DA_MAPPARE>`. Se volete sapere di più per quanto riguarda queste dichiarazione dei tipi in TypeScript potete leggervi direttamente dal sito di [DefinitelyTyped](http://definitelytyped.org/), ma per questa guida non è necessario approfondire oltre.

### Inizializzazione

Ora che abbiamo scaricato le librerie, dobbiamo configurarle per farle funzionare al meglio.
Iniziamo con **TypeScript**

```bash
npx typescript --init
```

Il comando significa:

- `npx`: avvia un programma che puoi trovare nella cartella `node_modules`.
- `typescript --init`: il comando di inizializzazione di TypeScript.

Dovrebbe aver creato il file `tsconfig.json` con i vari parametri di configurazione. Entriamo in questo file e dovremmo vedere commentato la parte `// "lib": [],`, decommentiamola e scriviamo:

```json
"lib": [
  "es2015"
]
```

Così facendo possiamo usare [le keyword async e await](https://javascript.info/async-await) quando avremo a che fare con le [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Ora passiamo a **TSLint**

```bash
npx tslint --init
```

Possiamo effettivamente vedere che è stato creato un file nella root con il nome `tslin.json`. Per ora va benissimo così, non lo tocchiamo.

Ora inizializziamo **Jest**, la nostra piattaforma di test, più o meno come abbiamo fatto con TSLint

```bash
npx jest --init
```

Dovrebbe riconoscere in automatico che c'è TypeScript, creare il file `jest.config.js` con all'interno la configurazione di default di Jest, ed infine ha inserito in `package.json` lo script `test`. In questo modo quando scriviamo in console `npm test`, Jest si avvia ed esegue tutti i test.

Qui dobbiamo fare una piccola modifica al file `jest.config.js`: dobbiamo rinominare il campo da `globals.ts-jest.tsConfigFile` a `globals.ts-jest.tsConfig` per evitare un messaggio di warning durante i test.
Quindi dovremo rinominare quella parte di configurazione in questo modo:

```javascript
globals: {
  "ts-jest": {
    "tsConfig": "tsconfig.json"
  }
}
```

Per essere sicuri di aver fatto tutto proviamo a scrivere finalmente un test: lo inseriremo nella cartella `src/__tests__` e lo chiamiamo `hello-test.ts`.

Quindi scriviamo nel file `src/__tests__/hello-test.ts`:

```typescript
test("should work", () => {
  expect(true).toBe(true);
});
```

Il test appena scritto non fa altro che verificare che `true` sia effettivamente `true`. A che serve? Nella vita reale a niente, ma nel nostro caso specifico serve a noi per capire che Jest sia configurato correttamente.

Avviamo i test con `npm test` e dovresti avere un risultato simile al mio.

```bash
$ npm test

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
  ✓ should work (5ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.553s
Ran all test suites.
```

Perfetto! Il nostro primo test in TypeScript ha funzionato.

## Analisi del progetto

Ora si inizia a fare sul serio: riprendiamo il nostro obiettivo e cominciamo a pensare come creare l'architettura.

Per raggiungere l'obiettivo abbiamo bisogno di tre parti:

1. Raccolta dei valori di input (URL e parola da cercare).
2. Scaricamento della pagina web.
3. Conteggio della parola nella pagina web appena scaricata.

## Test-Driven Development: si inizia!

Da dove iniziamo? Ovviamente con un test! Alla fine siamo qui per questo no? Imparare il Test-Driven Development.
Come si fa ad iniziare con un test? **Bisogna pensare a come creare un'architettura che possa essere facilmente testabile, dove ogni test controlla solo un unico aspetto del progetto**.

Utilizzeremo un [approccio bottom-up](https://it.wikipedia.org/wiki/Progettazione_top-down_e_bottom-up) per creare il progetto, ossia inizieremo dalla parte più semplice, autocontenuta che non ha bisogno di nessuna dipendenza per funzionare. In questo caso è il punto 3.

## Classe WordCounter

WordCounter è la nostra classe che serve per il "Conteggio della parola nella pagina web appena scaricata". Possiamo tradurlo anche in questo modo: "Data una stringa in input *text* e una parola da cercare *wordToFind*, restituisce il numero di volte che *wordToFind* è contenuta in *text*".

Iniziamo allora dal test: senza avere in mano questa classe WordCounter, che non esiste ancora, mi immagino di utilizzarla in questo modo:

```typescript
const text = "testo scaricato";
const wordToFind = "testo";

const wordCounter = new WordCounter();

wordCounter.count(text, wordToFind); // Output 1
```

Vediamo di tradurre questo ipotetico utilizzo in un test.
Nel nuovo file `src/__tests__/word-counter.ts` scriviamo:

```typescript
import WordCounter from "../word-counter";

describe("WordCounter", () => {
  const wordCounter = new WordCounter();

  it("should count the word inside text", () => {
    expect(
      wordCounter.count("testo scaricato", "testo"),
    ).toBe(1);
  });
});
```

Qui ci serve sapere un minimo come funziona Jest. In poche parole, useremo la convenzione di inglobare i test che sono riferiti ad una classe usando la funzione [describe](https://jestjs.io/docs/en/api#describename-fn), e poi ogni test della classe userà la funzione [it](https://jestjs.io/docs/en/api#testname-fn-timeout) che è il nostro test vero e proprio. La funziona `it` si compone di una stringa che spiega brevemente cosa andiamo a testare e una funzione che ha al suo interno la logica del test.  Per maggiori approfondimenti ti consiglio la loro [documentazione ufficiale](https://jestjs.io/docs/en/getting-started).

Ora che abbiamo scritto il nostro primo test, possiamo notare un vantaggio nello scrivere in TDD: **ci preoccupiamo solamente dell'interfaccia e non dell'implementazione**. Alla fine, l'utilizzatore finale delle nostre classi, interessa solo *come* invocare una determinata funzione, e non *come è stata fatta*. Capita spesso in programmazione di buttarsi a capofitto nell'implementazione per poi avere un'interfaccia convoluta e poco chiara, proprio perché nella programmazione tradizionale lo sforzo cognitivo va tutto nell'implementazione e l'interfaccia è una cosa secondaria. Qui invece si ribalta il tutto.

Una regola molto importante nel TDD è di **procedere a piccoli passi**. Non dobbiamo scrivere mille test per poi passare all'implementazione. Si scrive un solo test, che fallisce, e poi il nostro obiettivo è di far funzionare il test implementando il codice necessario. Perché tutto questo? Essenzialmente per due motivi:

1. **Sappiamo perfettamente qual è il nostro obiettivo, far passare l'unico test che fallisce**. In questo modo il progetto può essere complesso a piacere, ma mettendoci solo un piccolo obiettivo il tutto diventa semplice, *divide et impera* funziona sempre!
2. **Scriviamo il minimo indispensabile per far passare il test**. Quanti di noi si sono messi a scrivere montagne di codice perché "Non si sa mai", o perché la nostra mente ha pensato a mille casistiche che nessuno ha mai chiesto? Nel TDD non succede, ogni singola riga di codice è stata scritta per far passare un test. Se scriviamo altro stiamo sbagliando.

Ora che ci siamo detti che dobbiamo procedere a piccoli passi, andiamo effettivamente a scrivere il codice che renderà verde il nostro test. Prima di tutto verifichiamo che fallisca.

In console scriviamo `npm test`.

Come output abbiamo una cosa del genere.

```bash

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
 FAIL  src/__tests__/word-counter.ts
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/__tests__/word-counter.ts:1:25 - error TS2307: Cannot find module '../word-counter'.

    1 import WordCounter from "../word-counter";
                              ~~~~~~~~~~~~~~~~~

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.557s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

Il transpilatore di TypeScript si lamenta giustamente che la classe word-counter non esiste.

Ora scriviamo il minimo indispensabile per far passare il test. Andiamo a creare la classe e il metodo in `src/word-counter.ts`.

```typescript
export default class WordCounter {
  public count(text: string, wordToFind: string): number {
    return 1;
  }
}
```

Facciamo girare il test con `npm test`. E questo è il risultato:

```bash

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
 PASS  src/__tests__/word-counter.ts

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.669s
Ran all test suites.
```

Ce l'abbiamo fatta! Ma immagino che ti sei accorto che ho barato. Il metodo che ho scritto restituisce sempre 1, indipendentemente dal testo passato. Ma questo non è sbagliato nel TDD perché **il nostro obiettivo è far passare i test il prima possibile con il minimo indispensabile**. Se sono riuscito a barare significa che il test non è abbastanza approfondito per verificare il corretto funzionamento del programma.
Ora risolviamo scrivendo un test che ci obbliga a considerare l'input *text*. Nel file `src/__tests__/word-counter.ts` aggiungiamo

```typescript
it("should count the word inside text (multiple)", () => {
  expect(wordCounter.count("pippo pippo ciao pippo", "pippo")).toBe(3);
  expect(wordCounter.count("ciao ciao", "ciao")).toBe(2);
  expect(wordCounter.count("ciao", "nonesistequestaparola")).toBe(0);
});
```

Facendo girare i test effettivamente questo test fallisce

```bash
> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 FAIL  src/__tests__/word-counter.ts
  ● WordCounter › should count the word inside text (multiple)

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 1

      11 |
      12 |   it("should count the word inside text (multiple)", () => {
    > 13 |     expect(wordCounter.count("pippo pippo ciao pippo", "pippo")).toBe(3);
         |                                                                  ^
      14 |     expect(wordCounter.count("ciao ciao", "ciao")).toBe(2);
      15 |     expect(wordCounter.count("ciao", "nonesistequestaparola")).toBe(0);
      16 |   });

      at Object.<anonymous> (src/__tests__/word-counter.ts:13:66)

 PASS  src/__tests__/hello-test.ts

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        1.612s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

Ora cambiamo l'implementazione di `WordCounter.count` in `src/word-counter.ts` in modo tale da far passare il test

```typescript
public count(text: string, wordToFind: string): number {
  return text
    .split(" ")
    .filter((word) => word === wordToFind)
    .length;
}
```

I test sono entrambi OK! ...Ma c'è una cosa che non abbiamo testato, cosa succede se il testo da cercare è tutto minuscolo ma il testo è maiuscolo? **Non lo sappiamo e non ci preoccupiamo nemmeno di scoprilo, ci basta scrivere un test per essere sicuri**!

Aggiungiamo il test

```typescript
it("should count the word case insensitive", () => {
  expect(wordCounter.count("Ciao ciao CIAO", "ciao")).toBe(3);
});
```

Facendo girare i test fallisce... Allora risolviamo!

```typescript
public count(text: string, wordToFind: string): number {
  const wordToFindLower = wordToFind.toLowerCase();
  return text.toLowerCase()
    .split(" ")
    .filter((word) => word === wordToFindLower)
    .length;
}
```

Tutto ok, di nuovo. Ma non abbiamo considerato il testo dove la parola finisce con una virgola o un qualsiasi segno di interpunzione. Nuovo test

```typescript
it("should count word that have signs nearby", () => {
  expect(wordCounter.count("ciao, ciao! ", "ciao")).toBe(2);
});
```

Nuova implementazione per gestire questo test che fallisce

```typescript
public count(text: string, wordToFind: string): number {
    const wordToFindLower = wordToFind.toLowerCase();
    return text.toLowerCase()
      .split(/[^a-zA-Z\d]/)
      .filter((word) => word === wordToFindLower)
      .length;
  }
```

Tutto verde! Insomma ora è abbastanza chiaro come creare una classe in TDD. Abbiamo visto che **è un continuo ping pong di test che falliscono e implementazione che risolve il fail**.

Ma questo ping pong, oltre ai benefici che avevamo scritto in precedenza, ne porta anche altri:

- **Itera lo sviluppo di app complesse attraverso semplici passaggi, in modo incrementale**: è palese che abbiamo iniziato con un'implementazione molto semplice, e poi, tramite piccoli passi, siamo arrivati ad avere un metodo che gestisce numerose casistiche che magari non avevamo neppure pensato inizialmente.
- **I test scritti in precedenza rimangono, l'implementazione cambia continuamente**: forse tramite questo esempio non si nota molto, ma ogni volta che abbiamo aggiunto un nuovo test, e abbiamo cambiato l'implementazione, eravamo certi che **anche i test precedentemente scritti continuano a funzionare**. Questa certezza è fondamentale quando dobbiamo fare pesanti refactor dei metodi, senza il TDD questa certezza, il più delle volte, non esiste. Quindi si tende a non modificare il codice già esistente, si aggiunge il codice "attorno" per evitare di toccare una cosa "che funziona già" e quindi di evitare delle [regressioni nel software](https://en.wikipedia.org/wiki/Software_regression). Questo comportamento funziona ma per un breve periodo, il codice perde facilmente di leggibilità, diventa confuso e oscuro, ed ecco a voi il famoso [debito tecnico](https://it.wikipedia.org/wiki/Debito_tecnico)! Sono certo che vi è già capitato un codice del genere sottomano e non è divertente.
- **Tutte le funzionalità che ci servono sono testate**: questo è gratis con il TDD. Scriviamo prima il test e poi l'implementazione, per forza di cose è vero.

Ormai ci sentiamo soddisfatti con la nostra classe `WordCounter`. In realtà ci sarebbe un'altra altra casistica da testare. Per esempio

- Cosa succede se passiamo `null` ai due parametri? 

Dobbiamo inserire il test anche per questo caso? La risposta è *dipende*. Se sappiamo che il nostro codice non deve gestire i `null` possiamo anche farne a meno. Molti potrebbero ribattere che così il codice non è robusto, ma in realtà il nostro obiettivo non è gestire tutti i casi del mondo, dobbiamo creare una classe che sia ok per il nostro progetto. Quindi **bisogna cercare di rimanere focalizzati sull'obiettivo iniziale**, in questo modo non complichiamo il codice con casi che non accadono mai e non perdiamo tempo a scrivere codice e test inutili.

Ora che siamo soddisfatti del nostro `WordCounter` passiamo alla classe successiva.

## Classe TextFetcher

Questa classe risolve il punto 2 del nostro obiettivo. Ossia scarica una pagina web e recupera il testo da esso.
Ormai sappiamo come funziona e, carichi come una molla, usiamo lo stesso procedimento usato con `WordCounter`:

- Pensiamo all'interfaccia di TextFetcher: io mi immagino di utilizzarlo così `new TextFetcher().getContent(url)` e ci resituisce una `Promise<string>`, insomma ci restituisce una stringa in modo asincrono (non possiamo averlo sincrono perché la chiamata HTTP per recuperare il contenuto da un URL è lenta). Qui entra in gioco un prerequisito che avevo scritto in precedenza: la programmazione asincrona in JavaScript/TypeScript. Se volete capire fino in fondo gli esempi che andrò a scrivere vi consiglio le letture che ho inserito nella sezione prerequisiti.
- Scriviamo il test per testare la futura implementazione.

```typescript
import TextFetcher from "../text-fetcher"

describe("TextFetcher", () => {
  const textFetcher = new TextFetcher();

  it("should get the content as text", async () => {
    expect(
      await textFetcher.getContent("https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md")
    ).toContain("WordCounter");
  });
});
```

Se apriamo l'URL che ho inserito nel test possiamo vedere che è il `README.md` della repository che sto utilizzando per creare questa app.

Al suo interno c'è la parola WordCounter. Il nostro test verifica che effettivamente l'istanza `WordCounter` scarica il README e ci restituisce il suo contenuto. Nel test cerco solo la parola `WordCounter` e non esattamente il contenuto perché il README potrebbe cambiare, ma almeno il nome del progetto spero che rimanga sempre!

Ora proviamo a far passare il test (senza barare per non appesantire troppo il discorso). Per fare la chiamata HTTP che scarica il file, utilizzo una libreria famosissima in Node.js che è [Axios](https://github.com/axios/axios). Per questo motivo la installiamo tra le nostre dipendenze

```bash
npm install --save axios
```

Scriviamo una possibile implementazione in `src/text-fetcher.ts`

```typescript
import axios from "axios";

export default class TextFetcher {
  public async getContent(url: string): Promise<string> {
    return (await axios.get(url)).data;
  }
}
```

Abbiamo sostanzialmente creato ed esportato la classe `TextFetcher`, creato il metodo asincrono `async getContent`, nell'implementazione usiamo `axios` per scaricare il contenuto dell'`url`, aspettiamo in modo asincrono che scarichi il contenuto usando la keyword `await`, infine prendiamo il contenuto della risposta usando la proprietà `data`.

Facciamo girare i test con `npm test` ed ecco che tutto funziona!

Però non so se senti anche tu un piccolo odore di "bruciato"... Se hai notato ho messo nel test un'URL che va a prendere una risorsa esterna al nostro programma, che potrebbe cambiare, potrebbe non essere accessibile perché abbiamo il PC offline. Tutto questo influenzerebbe il nostro test facendolo fallire anche se in realtà il codice è giusto.

Ricorda che **gli unit tests devono essere veloci e non devono dipendere da fattori esterni**. La chiamata HTTP può essere lenta per via della connessione se non addirittura fallire per possibili cambiamenti o disconnessioni.

Come possiamo risolvere questo problema? Andremo a [mockare](https://it.wikipedia.org/wiki/Mock_object) la chiamata HTTP.

Per fare questo abbiamo bisogno di un'altra libreria esterna: [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

```bash
npm install --save-dev axios-mock-adapter
```

Andiamo a modificare il test in `src/__tests__/text-fetcher.ts`

```typescript
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import TextFetcher from "../text-fetcher";

describe("TextFetcher", () => {
  const textFetcher = new TextFetcher();

  const mock = new MockAdapter(axios);

  it("should get the content as text", async () => {
    const content = "Questo è il contenuto della pagina web";

    mock.onGet("/fake-url").reply(200, content);

    expect(
      await textFetcher.getContent("/fake-url"),
    ).toBe(content);
  });
});
```

Attraverso `MockAdapter` andiamo ad agganciarci alla libreria `axios`, in modo tale da creare delle chiamate HTTP false. Con `mock.onGet("/fake-url").reply(200, content);` andiamo a creare una finta risposta HTTP tramite l'indirizzo `/fake-url` con il valore della variabile `content` come contenuto. Infine andiamo a testare che la risposta sia effettivamente `content`.

Facendo girare i test funziona tutto e stavolta possiamo testare anche offline.

**Mockare le chiamate HTTP esterne ai vari URL oppure ai microservizi esterni è fondamentale per avere una buona suite di test unitari**. Non possiamo chiamare delle risorse reali durante i test unitari anche perché probabilmente queste risorse esistono sono nell'ambiente di produzione e noi non vogliamo sporcare il contenuto di produzione con dei test.

## Classe CounterApp

Questa è l'ultima classe che andremo a costruire. Il suo obiettivo è quello di:

- Invocare il `TextFetcher` per recuperare il testo dall'URL.
- Invocare il `WordCounter` per contare quante volte la parola da cercare è contenuta nel testo scaricato.
- Restituire il numero ritornato da `WordCounter`.

**Negli unit tests di una classe non vogliamo testare l'implementazione anche delle sue dipendenze**. Nel nostro caso non vogliamo testare di nuovo `TextFetcher` e `WordCounter`. Queste classi le abbiamo testate già bene. Per questo motivo andremo a mockare queste dipendenze un po' come abbiamo fatto per le chiamate HTTP.

Mockando le dipendenze esterne da una classe porta i seguenti vantaggi:
- **Evitiamo che un errore nella dipendenza faccia fallire anche i test della classe che stiamo testando**. Idealmente un errore nel codice dovrebbe far fallire un solo test, e non anche tutte le parti che dipendono da esso.
Abbiamo quindi bisogno di una libreria che si chiama [ts-mockito](https://github.com/NagRock/ts-mockito) che si ispira alla famosa libreria di Mock su Java chiamata [Mockito](https://site.mockito.org/).
- **Rende semplice creare dei casi speciali**: immaginate che dobbiamo testare correttamente la gestione di un eccezione, la generazione di questa eccezione richiede una situazione molto particolare. Se mockiamo possiamo iniettare un mock che generi questa eccezione senza dover ricreare questa situazione speciale.

Mettiamo in pratica ciò che ci siamo detti. Primo passo è installare `ts-mockito`.

```bash
npm install --save-dev ts-mockito
```

Andiamo a scrivere il test nel nuovo file `src/__tests__/counter-app.ts`

```typescript
import { instance, mock, when } from "ts-mockito";
import CounterApp from "../counter-app";
import TextFetcher from "../text-fetcher";
import WordCounter from "../word-counter";

describe("CounterApp", () => {
  // Initialization
  const mockWordCounter: WordCounter = mock(WordCounter);
  const mockTextFetcher: TextFetcher = mock(TextFetcher);
  const counterApp = new CounterApp(instance(mockTextFetcher), instance(mockWordCounter));

  it("should get parameters and return the count", async () => {
    const providedUrl = "url";
    const providedWordToFind = "word";
    const fakeContent = "Testo recuperato";
    const expectedCount = 1;

    when(mockTextFetcher.getContent(providedUrl))
      .thenReturn(Promise.resolve(fakeContent));
    when(mockWordCounter.count(fakeContent, providedWordToFind))
      .thenReturn(expectedCount);

    expect(await counterApp.countWordFromUrl(providedUrl, providedWordToFind))
      .toBe(expectedCount);
  });
});
```

Nell'inizializzazione andiamo a creare i mock delle nostre due classi `WordCounter` e `TextFetcher`, con la riga `new CounterApp(instance(mockTextFetcher), instance(mockWordCounter))` andiamo ad inserire le istanze dei nostri mock nel costruttore della classe `CounterApp`. Questa tecnica di "iniettare" le dipendenze utilizzate direttamente nel suo costruttore si sposa bene con i frameworks che utilizzano la [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection). Se quest'ultima frase che ho scritto è puro arabo, non preoccuparti. Il messaggio che deve passare è questo: **è buona prassi richiedere nel [costruttore](https://it.wikipedia.org/wiki/Costruttore_(informatica)) le dipendenze esterne che la classe ha bisogno per funzionare correttamente**. Questo è vero per due motivi:

- Indica chiaramente al programmatore che utilizza la vostra classe, quali dipendenze ha bisogno per svolgere la propria funzione.
- Rende facile i test della classe in questione, perché nel costruttori possiamo iniettare delle istanze mockate, come nel nostro caso.

La parte all'interno del test `it("should get parameters and return the count", ...)` dovrebbe essere abbastanza autoesplicativa: creo le variabili che mi aspetto di utilizzare e poi utilizzo [ts-mockito](https://github.com/NagRock/ts-mockito) per fare le dovute asserzioni. Per esempio con `when(mockTextFetcher.getContent(providedUrl)).thenReturn(Promise.resolve(fakeContent));` significa: "quando la classe chiama `textFetcher` utilizzando il metodo `getContent` con il parametro `providedUrl`, ritorna una `Promise` risolta con il valore `fakeContent`". La funzionalità `when(...).thenReturn(...)` serve a noi per bypassare la vera implementazione delle classi mockate e ritornare un valore che decidiamo noi.

Così facendo stiamo testando:
- Che la classe `CounterApp` chiami i metodi delle classi `WordCounter` e `TextFetcher` con i parametri corretti, tramite i vari `when(...).thenReturn(...)`.
- Che la classe `CounterApp` ritorni il numero corretto tramite `expect(...).toBe(...)`.

Facciamo girare i test con `npm test`. Chiaramente fallisce, ora andiamo ad implementare la classe nel nuovo file `src/counter-app.ts`;

```typescript
import TextFetcher from "./text-fetcher";
import WordCounter from "./word-counter";

export default class CounterApp {
  constructor(private textFetcher: TextFetcher, private wordCounter: WordCounter) {

  }

  public async countWordFromUrl(url: string, wordToFind: string): Promise<number> {
    const text = await this.textFetcher.getContent(url);
    return this.wordCounter.count(text, wordToFind);
  }
}
```

Abbiamo creato un costruttore che inserisce nelle variabili private `textFetcher` e `wordCounter` le istanze di `TextFetcher` e `WordCounter` (il costruttore è vuoto, sembra che non faccia niente, ma il lavoro sporco lo sta facendo la [keyword private](https://www.stevefenton.co.uk/2013/04/stop-manually-assigning-typescript-constructor-parameters/)). Poi abbiamo implementato il metodo asincrono `countWordFromUrl` che non fa altro che scaricare il contenuto dall'URL e poi conteggia il numero delle volte che compare la parola che stiamo cercando e lo ritorna.

Proviamo con `npm test` ed effettivamente è tutto ok!

## Prova reale

Ora che finalmente abbiamo raggiunto il nostro obiettivo, programmando completamente in TDD, proviamo a fare una prova reale.

Creiamo il file `src/index.ts` dove inserirò un piccolo script per provare il tutto.

```typescript
import CounterApp from "./counter-app";
import TextFetcher from "./text-fetcher";
import WordCounter from "./word-counter";

async function testApp() {
  const url = "https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md";
  const wordToFind = "WordCounter";

  const count = await new CounterApp(new TextFetcher(), new WordCounter())
    .countWordFromUrl(url, wordToFind);

  console.log(`The word "${wordToFind}", in ${url}, appears ${count} times`);
}

testApp();
```

Ho creato una piccola funzione `testApp` dove crea la mia classe `CounterApp` con le dovute dipendenze, e provo a contare quante volte compare la parola `WordCounter` dalla pagina [README.md](https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md) della mia repository per questo progetto.
Per avviare il programma, ho bisogno di transpilare TypeScript in JavaScript, perché come sappiamo Node.js non sa leggere direttamente TypeScript. Per risolvere utilizzerò la libreria [ts-node](https://github.com/TypeStrong/ts-node).

`npm install --save-dev ts-node`

Ora che è installato, avviamo il nostro script in questo modo

```bash
npx ts-node src/index.ts
```

Il risultato è questo:

```bash
The word "WordCounter", in https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md, appears 1 times
```

Funziona!!!

## Mantenimento del progetto

Abbiamo finito il nostro piccolo progettino in TDD. Ma un vero progetto che si rispetti non è mai "finito", bisogna mantenerlo e migliorarlo ogni giorno. Un altro vantaggio che ho apprezzato dopo qualche mese di sviluppo in TDD è il tempo drasticamente calato in termini di debugging o di bug in produzione. Quindi **il tempo speso a scrivere test è di gran lunga ricompensato dal tempo risparmiato dal debugging del prodotto**. Provare per credere!
Però non pensare che i bug non esistano più utilizzando il TDD. Sono molto di meno ma ogni tanto capitano. Quando capitano dobbiamo sempre ricordarci di **scrivere il test che manifesta il bug prima di fixare il bug**. In questo modo continuiamo ad usare il TDD, ma soprattutto abbiamo la garanzia che il bug non si manifesterà più anche se noi andiamo a modificare pesantemente il codice in futuro.

## Quando utilizzare il TDD

Ora che abbiamo visto cosa è il TDD, una domanda può sorgere spontanea: **quando si dovrebbe utilizzare il TDD?** Qui meglio fare una distinzione: **se devo scegliere tra il TDD e i test unitari classici, per esperienza personale sceglierei sempre il TDD**. L'approccio classico non mi ha mai portato nessun giovamento rispetto al TDD. L'unico "vantaggio" che ho visto è che l'approccio classico permette di non testare tutto, ma sinceramente non lo reputo un vantaggio proprio perché crea dei buchi pericolosi che vanificano gran parte dei vantaggi che abbiamo trovato in questa guida.

Se invece la scelta è tra il TDD e solamente l'implementazione senza test unitari il discorso cambia.
Sicuramente queste sono le casistiche dove si dovrebbe utilizzare il TDD (o almeno test unitari).

- Sistemi di backend: quando si hanno dei clienti (mobile app, microservizi etc.) che si appoggiano al nostro sistema è fondamentale che il backend funzioni perfettamente.
- Parti "mission critical": se abbiamo delle componenti che devono funzionare e sono cruciali per erogare il nostro servizio, non possiamo permetterci di avere dei bug o andare sulla fiducia.
- Componenti che sono difficili da testare "live": se ci impiego 5 minuti solo per testare una singola volta una casistica speciale, meglio spenderli per creare un test che poi almeno ce l'ho sempre e mi basta un `npm test` per ricontrollare.

**Quando invece non serve il TDD e si può andare solamente con l'implementazione?** Sembra un'eresia ma io ho trovato alcuni casi in cui solo l'implementazione basta e avanza:

- Quando la nostra implementazione è facilmente testabile "live": mai sentito parlare di live-reloading? Con le web-app o anche nello sviluppo di app ibride con [Flutter](https://flutter.io/), [Ionic](https://ionicframework.com/) o [React Native](https://facebook.github.io/react-native/), è possibile implementare e visionare subito l'output. Questo è uno strumento potentissimo che velocizza enormemente lo sviluppo, ma soprattutto il tempo tra l'implementazione e il risultato finale è pari a zero. Che serve scrivere i test se mi basta salvare il codice e subito vedo il risultato finale e posso provarlo?
- Quando ci possiamo permettere qualche libertà, le specifiche sono ancora fumose ed il nostro cliente è a stretto contatto con lo sviluppo: mi è capitato di sviluppare letteralmente con il cliente che poteva darmi i feedback quasi in tempo reale. Se l'ambiente è molto informale/colloquiale è possibile creare un intero progetto senza scrivere una riga di test ed il cliente è contento comunque anche se magari di tanto in tanto ti chiama per segnalare un bug. L'importante è che possiate risolverlo velocemente così che il cliente possa apprezzare la vostra rapidità nel fix.
- Quando il progetto è un esperimento: certe volte capita di creare un progetto solo per capire se una determinata cosa possa funzionare. Oppure si implementa una piccola variazione per fare A/B testing, o ancora si sviluppa una cosa temporanea per ovviare ad un problema altrettanto temporaneo. In questi casi non apprezzeremo mai i vantaggi del TDD, perché il tempo speso nei test non verrà compensato dal tempo risparmiato dal debugging o fix di bug.

Il messaggio che deve passare è questo: valutate il vostro caso e agite di conseguenza. **Il TDD è la soluzione a molti problemi, ma non a tutti**.

## Conclusioni 

Prima di tutto mi scuso se leggendo questa guida magari non è passato molto il concetto del "è più semplice di quanto si creda". 
Ma non dimenticare che qui hai visto numerosi concetti che, se è la prima volta che li vedi, ci vuole un po' di tempo per digerirli. Se magari ti sei perso i concetti che hai imparato in questo articolo ti faccio un piccolo sommario:

- Inizializzazione di un progetto in Node.js, utilizzo del packet manager `npm`.
- Inserimento di TypeScript con Linter integrato.
- Utilizzo di Jest per il testing.
- Programmazione asincrona con con le keyword `async` e `await` introdotte in ECMAScript 2017.
- Utilizzo di librerie di Mocking, quando e perché usarle.
- Test Driven Development.

All'inizio il TDD sembra un freno, come tutte le cose nuove, ma una volta preso dimestichezza, tutto diventa più veloce e anche più divertente! Fa sempre piacere arrivare a fine giornata e vedere il proprio progetto che cresce insieme ai test che aumentano e sono tutti verdi... *tranne uno*! Ebbene sì: **a fine giornata, se il progetto non è concluso, scriviamo un test che fallisce prima di andare via**. Questo è un consiglio che è molto efficace per riprendere i lavori. In questo modo ci ricordiamo perfettamente cosa stavamo facendo quando ritorneremo a lavorare. Il test fallito ci dirà esattamente cosa abbiamo lasciato indietro.

Spero che questo articolo ti abbia fatto venire voglia di provare questa affascinante tecnica che, a primo impatto, può sembrare quasi assurda, ma una volta adottata, aumenta enormemente la qualità del codice e di conseguenza anche la qualità del prodotto finale.

Se volete vedere il TDD in azione con Spring Boot potete leggere il mio articolo che parla di [come sviluppare delle API RESTful in TDD con Spring Boot](/come-sviluppare-rest-api-in-tdd-con-spring-boot).

Alla prossima!

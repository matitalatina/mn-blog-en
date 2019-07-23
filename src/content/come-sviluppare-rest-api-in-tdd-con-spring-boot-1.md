---
layout: post
title: Come sviluppare delle API in TDD con Spring Boot · Parte 1
image: img/soundcloud-download/music.jpg
author: Mattia Natali
date: 2019-08-13T07:03:47.149Z
tags: 
  - Dev
  - How-to
  - TDD
  - Testing
draft: true
---

[In questo articolo](**************) abbiamo visto cosa significa sviluppare in Test Driven Development (TDD) e i pregi che ne derivano. L'esempio utilizzato potrebbe sembrare un giochino fino a se stesso, ma il mio focus lì era di spiegare il TDD per chi proprio non ne aveva mai sentito parlare.

In questa guida invece vediamo insieme un caso d'uso che ci sarà molto più familiare: lo sviluppo delle REST API. Per far ciò ho deciso di utilizzare il framework Spring Boot, il linguaggio scelto è Java.
Spring boot è molto utilizzato in ambito enterprise per creare un'architettura a microservizi. Anche [Netflix lo utilizza](https://hub.packtpub.com/netflix-adopts-spring-boot-as-its-core-java-framework/). Inoltre Java è un linguaggio di programmazione ormai noto a tutti e quindi penso sia una buona scelta per vedere insieme un esempio pratico.

Come sempre iniziamo completamente da zero, per non lasciare nulla al caso. Oltre al TDD, vedremo insieme anche come strutturare in modo corretto il progetto e altre librerie molto comode che uso ogni giorno per aumentare la mia produttività, come per esempio la libreria [Lombok](https://projectlombok.org/).

## Obiettivo

Immaginiamo che dobbiamo creare due endpoints:

- `GET - /api/v1/vehicles/{id}`: per il recupero di un veicolo tramite id.
- `POST - /api/v1/vehicles`: per l'aggiunta di un veicolo.

Il veicolo è composto da queste proprietà

```json
{
  id: 1,
  brand: "Ferrari",
  model: "488 GTB",
  year: 2019
}
```

Il `brand`, `model` e `year` sono obbligatori, l'anno di produzione del veicolo non può essere antecedente al `1950` per ragioni di business.

Per ora non siamo interessati ad altri endpoints.

## Creiamo il progetto

Ora che abbiamo le idee chiare su cosa dobbiamo fare, andiamo a generare il progetto.
Il modo migliore per farlo è andando sul sito [Spring Initializr](https://start.spring.io/). Da qui possiamo decidere quali librerie integrare, versione di Java ecc.

La configurazione che ho scelto io è la seguente:

- Project: Gradle Project. Probabilmente avrete già sentito parlare di Maven come gestore delle dipendenze e build tool per Java. Se invece sviluppate su Android, con Gradle vi sentirete a casa, dato che è quello usato di default.
- Language: Java.
- Spring Boot: 2.1.6.
- Project Metadata:
  - Group: it.mattianatali.
  - Artifact: tdd-spring-boot-api.
  - Name: tdd-spring-boot-api.
  - Description: Sample project to explain how to develop APIs in TDD with Spring Boot.
  - Package Name: it.mattianatali.tdd-spring-boot-api.
  - Packaging: Jar.
  - Java: 12.
- Dependencies:
  - Spring Web Starter: fornisce le varie annotazioni per creare delle API RESTful in modo semplice e veloce.
  - Lombok: è una libreria Java che ci permette di ridurre la verbosità del nostro codice Java.
  - Spring Data JPA: fornisce tutto l'occorrente per la persistenza dei dati.
  - H2 Database: fornisce un DB in memory. In produzione sarebbe opportuno usare un DB PostgreSQL o MySQL, ma per non perderci troppo nella configurazione del DB, ho preferito usare H2.

Premiamo "Generate the project". Ci ritroviamo un bel file zip. Scompattiamo in una cartella a nostro piacimento.
Apriamo il progetto, io utilizzo IntelliJ.

### Abilitiamo lombok e l'annotation processor in IntelliJ

Se è la prima volta che usate Lombok, avete bisogno del Plugin "Lombok". Aprite "Preferences", andate su "Plugins", cercate "Lombok" sul marketplace e installatelo.

Una volta aperto il progetto in IntelliJ, dobbiamo abilitare l'annotation processor. Per fare questo aprite "Preferences", cercate "annotation" e spuntate l'opzione "Enable annotation processing".


******************* IMMAGINE ***************

### Carichiamo JUnit 5

Purtroppo la dipendenza per i test `org.springframework.boot:spring-boot-starter-test`, che possiamo trovare nel file `build.gradle`, utilizza ancora JUnit 4. Siccome più avanti utilizzeremo delle funzionalità avanzate, abbiamo bisogno di JUnit 5.

Per raggiungere l'obiettivo, aggiungiamo nel file `build.gradle` le dipendenze per JUnit 5.

```groovy
dependencies {
  ...
  testImplementation 'org.junit.jupiter:junit-jupiter-api'
  testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine'
  testImplementation 'org.junit.jupiter:junit-jupiter-params'
  testImplementation 'org.mockito:mockito-junit-jupiter'
}
```

Infine ci serve "avvisare" Gradle di utilizzare JUnit 5 durante il comando di test `./gradlew test` e di mostrare i logging completo. Così ci è più semplice debuggare in caso di problemi.
Sempre nel file `build.gradle` aggiungiamo in fondo

```groovy
test {
 useJUnitPlatform()
 testLogging {
  exceptionFormat = 'full'
 }
}
```

Nel nostro progetto, c'è già un file di test scritto in JUnit 4. Il file si trova in `src/test/java/it/mattianatali/tddspringbootapi/TddSpringBootApiApplicationTests.java`. Questo test prova semplicemente a caricare il contesto di Spring. Può sembrare un test banale, ma a mano a mano che il progetto cresce, basta poco per dimenticarsi qualche annotazione e che quindi Spring non si carica correttamente.

Il nostro primo passo è di migrarlo a JUnit 5

Dovrebbe essere scritto così

```java
package it.mattianatali.tddspringbootapi;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TddSpringBootApiApplicationTests {

	@Test
	public void contextLoads() {
	}

}
```

Noi lo modifichiamo così:

```java
package it.mattianatali.tddspringbootapi;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class TddSpringBootApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
```

Avete notato delle differenze? Per migrare un test da JUnit 4 a JUnit 5 bisogna stare attenti a queste cose:

- Modificare l'annotazione `@RunWith(SpringRunner.class)` con `@ExtendWith(SpringExtension.class)`.
- Essere certi di avere **sempre** la scritta `junit.jupiter` nell'`import` di tutte le classi di JUnit. Infatti Se leggete `jupiter` significa che state usando JUnit 5. Possiamo notare che l'annotazione `@Test` ha cambiato package... Ricordatevi dovete usare `junit.jupiter`!
- Le classi di test e i metodi non devono essere necessariamente `public`. Se usate IntelliJ si lamenterà di questo fatto.

Ora proviamo a vedere se la nostra suite di test è configurata correttamente. Per far ciò creiamo un test temporaneo che sicuramente fallisce.

```java
...
import static org.junit.jupiter.api.Assertions.fail;
...
class TddSpringBootApiApplicationTests {
  ...

  @Test
	public void shouldFail() {
    fail("You shall not pass!");
	}
}
```

I puntini di sospensione `...` nel codice significa che c'è altro nel file che però non ho scritto per evitare distrazioni.

Proviamo a far girare i test: utiliziamo IntelliJ oppure Gradle con il comando `./gradlew test` (io utilizzo Mac quindi Unix style).
Ci aspettiamo che un test passi e l'altro fallisca.

L'output del test è il seguente

```bash

> Task :test FAILED

it.mattianatali.tddspringbootapi.TddSpringBootApiApplicationTests > shouldFail() FAILED
    org.opentest4j.AssertionFailedError: You shall not pass!
        at org.junit.jupiter.api.AssertionUtils.fail(AssertionUtils.java:38)
        at org.junit.jupiter.api.Assertions.fail(Assertions.java:84)
        at it.mattianatali.tddspringbootapi.TddSpringBootApiApplicationTests.shouldFail(TddSpringBootApiApplicationTests.java:20)
2019-07-20 12:56:43.465  INFO 13515 --- [       Thread-4] o.s.s.concurrent.ThreadPoolTaskExecutor  : Shutting down ExecutorService 'applicationTaskExecutor'
2019-07-20 12:56:43.466  INFO 13515 --- [       Thread-4] j.LocalContainerEntityManagerFactoryBean : Closing JPA EntityManagerFactory for persistence unit 'default'
2019-07-20 12:56:43.466  INFO 13515 --- [       Thread-4] .SchemaDropperImpl$DelayedDropActionImpl : HHH000477: Starting delayed evictData of schema as part of SessionFactory shut-down'
2019-07-20 12:56:43.468  INFO 13515 --- [       Thread-4] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2019-07-20 12:56:43.472  INFO 13515 --- [       Thread-4] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.

2 tests completed, 1 failed

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':test'.
> There were failing tests. See the report at: file:///Users/mattia/Repositories/tdd-spring-boot-api/build/reports/tests/test/index.html

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 5s
4 actionable tasks: 2 executed, 2 up-to-date
```

È proprio quello che ci aspettavamo! Ora **togliamo il test che fallisce** e possiamo essere certi che JUnit 5 è configurato alla perfezione!

## Come strutturare il backend

Prima di iniziare a scrivere il codice dobbiamo essere allineati su come andremo ad architettare il nostro software.
Solitamente, il minimo indispensabile per creare un backend che espone delle API RESTful è implementare tre tipi di classi:

- **Controller**: il suo unico scopo è di validare i valori in input, dichiarare gli endpoint che vogliamo esporre, di invocare un service e di fornire la risposta data dalla classe service.
- **Service**: al suo interno abbiamo la vera logica di business che dipende dal progetto, fa il lavoro sporco e se deve persistere qualche dato, invoca i repository.
- **Repository**: esiste per persistere i dati da qualche parte, solitamente in un DB.

Ovviamente si può fare tutto in una classe, ma se vogliamo strutturare del buon codice testabile e riusabile, questo è il minimo. Dobbiamo sempre ricordarci che più una classe ha uno scopo ben preciso, più è semplice da implementare ma soprattutto è facile da riutilizzare in altri punti.

## Implementiamo la chiamata GET

Iniziamo! La chiamata `GET - /api/v1/vehicles/{id}` abbiamo detto che deve fornire il dettaglio del veicolo. Per sviluppare immagino di essere la richiesta HTTP. La prima classe che viene intaccata dalla chiamata è il controller, come abbiamo detto la sua funzione è quella di validare i valori di input e di esporre appunto l'endpoint che andiamo a chiamare.
Andiamo a creare il controller. Creiamo il file `src/main/java/it/mattianatali/tddspringbootapi/vehicle/VehicleController.java`.

```java
package it.mattianatali.tddspringbootapi.vehicle;

public class VehicleController {
}
```

Per ora ci basta questo, stiamo sviluppando in TDD quindi la nostra implementazione deve essere guidata dai test. Con IntelliJ possiamo premere `cmd` + `shift` + `T`, selezionare "Create New Test..." e confermare. In questo modo ci troviamo il file di test creato ad hoc per il nostro controller.

Pensiamo ora cosa deve fare il nostro controller per raggiungere l'obiettivo:

- Dichiarare che esiste l'endpoint `GET - /api/v1/vehicles/{id}`.
- Ricevere l'id del veicolo dal path della chiamata.
- Chiamare il servizio `VehicleService`, che non esiste ancora, con l'id preso dal punto precedente.
- Se `VehicleService` restituisce un veicolo, allora risponde con un `200 - Ok` come `statusCode` e il veicolo nel body, altrimenti risponde con un bel `404 - Not Found`.

### Versione Semplificata

Siccome siamo alle prime armi con il TDD, è veramente difficile fare un test così completo al primo tentativo.
Cerchiamo allora di procedere per piccoli passi. **Testiamo una versione semplificata**.

Il nostro primo test verificherà solo questo, poi pian piano aggiungiamo i punti rimanenti:

- Verificare che esiste l'endpoint `GET - /api/v1/vehicles/{id}`.
- Restituisce come statusCode `200 - Ok`.

Il nostro test è il seguente:

```java
package it.mattianatali.tddspringbootapi.vehicle;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void getDetail_shouldReturn200() throws Exception {
        var vehicleId = 1;
        mvc.perform(get("/api/v1/vehicles/" + vehicleId))
                .andExpect(status().isOk());
    }
}
```

Ora spieghiamo punto per punto le cose nuove che non abbiamo mai visto:

- `@ExtendWith(SpringExtension.class)` serve per collegare il contesto di JUnit con il framework di Spring Boot. In questo modo possiamo usare delle annotazioni che comunemente usiamo con Spring Boot più altre annotazioni che esistono apposta per semplificare la vita durante il testing, come appunto la successiva.
- `@WebMvcTest(VehicleController.class)` è il nostro modo per dire a JUnit 5 + Spring Boot: "Voglio testare solo la parte adibita al controller `VehicleController`, quindi evita di caricare tutto il contesto di Spring Boot". In altre parole il nostro test si avvierà più velocemente perchè il nostro test sa bene che non deve caricare per esempio Hibernate, caricare i drivers del DB, configurazioni, servizi, repositories o altre cose, perchè non ne abbiamo bisogno. Stiamo testando solo quel controller. Se invece vogliamo testare qualcosa caricando tutto il contesto di Spring Boot possiamo usare l'annotazione `@SpringBootTest`. Ma è sempre meglio evitare per non rallentare il caricamente ed esecuzione dei test.
- `@Autowired private MockMvc mvc` significa "Spring Boot: forniscimi un modo per comunicare con il controller che ho definito nell'annotazione precedente (`VehicleController`), facendo delle chiamate HTTP grazie ad esso". `@Autowired` significa che è Spring Boot a fornircelo, non dobbiamo preoccuparci come lo istanzia per noi. `MockMvc mvc` è la nostra istanza che useremo per fare le chiamate HTTP.

Io solitamente adotto questa convenzione per i nomi dei test: `nomeMetodo_cosaStiamoTestando`. Non preoccupatevi di scrivere un nome troppo lungo, non andrete mai a riscrivere il nome del metodo. Qui è importante essere chiarissimi cosa stiamo testando e cosa ci aspettiamo. Ogni volta che programmate mettetevi nei panni di un altro sviluppatore che non sa nulla di quello che state facendo, cercate di semplificare la vita al prossimo: in questo caso più siamo chiari, più i nostri colleghi saranno felici del nostro lavoro.

- `mvc.perform(get("api/v1/vehicles/" + vehicleId))` è il nostro modo per fare una chiamata `GET` all'endpoint che stiamo testando.
- `.andExpect(status().isOk())` è la nostra asserzione sullo `statusCode` della nostra chiamata HTTP, ci aspettiamo un bel `200`. 

Facciamo girare il test, ci aspettiamo che fallisca e che invece dello `statusCode` `200` ci restituisce un `404`, perchè l'endpoint non è stato ancora dichiarato. Con IntelliJ è molto facile testare un singolo test, basta premere sulla freccia verde vicino al nome del metodo.

Questo è il risultato del nostro test:

```bash
2019-07-20 16:33:15.748  WARN 14736 --- [    Test worker] o.s.web.servlet.PageNotFound             : No mapping for GET api/v1/vehicles/1

...
Status expected:<200> but was:<404>
Expected :200
Actual   :404
<Click to see difference>

java.lang.AssertionError: Status expected:<200> but was:<404>
	...
```

Esattamente come ci aspettavamo.

Ora andiamo ad implementare il minimo indispensabile per far passare il test. Scriviamo in `VehicleController`

```java
package it.mattianatali.tddspringbootapi.vehicle;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VehicleController {
    @GetMapping("/api/v1/vehicles/{id}")
    void getVehicleDetails(@PathVariable Long id) {

    }
}
```

- `@RestController` è l'annotazione di Spring Boot che serve per dichiarare che stiamo creando un Controller.
- `@GetMapping("/api/v1/vehicles/{id}")` dichiariamo l'esistenza del nostro endpoint con il metodo `GET` e che ha una variabile nel path chiamata `id`.
- `@PathVariable Long id` serve per estrapolare l'id dal path.

Come possiamo notare non restituiamo nulla dall'endpoint... Infatti non abbiamo messo nessuna asserzione nel test, quindi non è necessario mettere altro. Per ora vogliamo solo testare che risponda con `statusCode` `200`. Che è il valore di default se non inseriamo niente.

Facciamo girare il test, aspettiamo qualche secondo, e stavolta è verde! Possiamo facilmente intuire che il nostro test non è sufficiente, ora miglioriamolo in modo tale da testare almeno "l'happy path" completo.

### Versione Completa

Modifichiamo il test rendendolo completo:

```java
package it.mattianatali.tddspringbootapi.vehicle;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private VehicleService vehicleService;

    @Test
    void getDetail_shouldReturnVehicleIfFound() throws Exception {
        var vehicleId = 1L;
        var returnedVehicle = Vehicle.builder()
                .id(vehicleId)
                .brand("Ferrari")
                .model("488 GTB")
                .year(2019)
                .build();

        when(vehicleService.get(vehicleId)).thenReturn(Optional.of(returnedVehicle));

        mvc.perform(get("/api/v1/vehicles/" + vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(returnedVehicle.getId().intValue())))
                .andExpect(jsonPath("$.brand", is(returnedVehicle.getBrand())))
                .andExpect(jsonPath("$.model", is(returnedVehicle.getModel())))
                .andExpect(jsonPath("$.year", is(returnedVehicle.getYear())));
    }
}

```

In questo momento c'è il nostro compilatore che si sta disperando perchè non trova `VehicleService` e nemmeno la classe `Vehicle`... Infatti non li abbiamo ancora creati!

Anche in questo caso vediamo cosa c'è di nuovo:

- `@MockBean private VehicleService vehicleService` stiamo dicendo a Spring Boot: "Se qualche classe ti chiede il servizio `VehicleService`, tu non passare la vera implementazione, ma fornisci un'istanza finta, dove io posso decidere cosa ritornare nell'invocazione dei metodi". Infatti più avanti con il metodo `when` possiamo decidere cosa ritornare come valore, senza andare a richiamare la vera implementazione. Il discorso di cosa vuol dire "Mockare" le classi è già stato trattato nel mio articolo precedente, se non vi è chiaro è meglio che [leggiate la puntata precedente](*******************).
- `var returnedVehicle = Vehicle.builder()....build()` stiamo semplicemente creando un modello di veicolo che verrà restituito in output dal `VehicleService` e di conseguenza dal controller. In questo caso useremo il builder che ci fornisce Lombok, non preoccupatevi per ora, quando creeremo la classe sarà più chiaro.
- `when(vehicleService.get(vehicleId)).thenReturn(Optional.of(returnedVehicle));` stiamo dicendo "se qualcuno invoca `vehicleService.get` con l'id `vehicleId`, allora ritorna un opzionale con il nostro veicolo appena creato".
- `.andExpect(jsonPath("$.id", is(returnedVehicle.getId())))` significa che ci aspettiamo nel JSON ritornato un campo id, con dentro l'id del nostro veicolo creato. Le altre righe sono molto simili, cambia solo il campo che andiamo a controllare.

Non possiamo far girare i test perchè il codice non compila nemmeno. Andiamo allora a creare le classi mancanti. Con IntellJ è molto semplice creare classi o metodi che non esistono ancora, basta spostare il cursore sulla classe inesistente, premere `alt` + `Invio`, cliccare su "Create class ...", come target directory scegliere `main` e non `test`, e confermate.

Facciamo questo procedimento con `Vehicle`. Poi implementiamola.
Il file dovrebbe trovarsi in `/src/main/java/it/mattianatali/tddspringbootapi/vehicle/Vehicle.java`

```java
package it.mattianatali.tddspringbootapi.vehicle;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Vehicle {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
}
```

Qui possiamo vedere Lombok in azione! Grazie all'annotation `@Data` non dobbiamo scrivere ne getter, ne setter, ne fare l'override di equals o hash, fa tutto lui! Con `@Builder` invece ci viene gratis un comodo builder che abbiamo già usato nel test.
Meno codice da scrivere significa meno codice da gestire e testare!

Ora dobbiamo creare il `VehicleService`. In questo caso scriviamo il minimo indispensabile per poter compilare, ci dobbiamo ricordare che nel test usiamo la versione mockata, quindi la vera implementazione ora non ci interessa. Ci preoccuperemo quando andremo a sviluppare in TDD su di essa. Anche qui possiamo farci aiutare da IntelliJ.

Una volta creata la classe, possiamo dire ad IntelliJ di creare il metodo `VehicleService.get` che abbiamo invocato nella riga di test `when(vehicleService.get(vehicleId))`. `alt` + `invio` è il nostro migliore amico in questo caso.

Il file `src/main/java/it/mattianatali/tddspringbootapi/vehicle/VehicleService.java` conterrà quindi

```java
package it.mattianatali.tddspringbootapi.vehicle;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VehicleService {
    public Optional<Vehicle> get(long vehicleId) {
        return null;
    }
}

```

- `@Service` serve a dire che la classe è un servizio e che può essere creata da Spring Boot tramite la Dependency Injection (DI) e iniettata nelle altre classi quando usano l'annotazione `@Autowired`.

Il metodo è ovviamente sbagliato, ma ripeto, ora ci interessa solo che compili in modo tale da far girare i test.

Qui c'è una cosa molto interessante da notare: abbiamo definito prima la *firma* del metodo prima di pensare alla sua attuale implementazione. In questo molto definiamo le classi dal punto di vista dell'*utilizzatore* e non del *creatore*. Solitamente questo è un bene perchè si creano delle firme dei metodi facilmente utilizzabili. Se invertiamo il procedimento finiamo di semplificare l'implementazione ma rendiamo difficile l'utilizzo delle classi create perchè appunto non pensiamo a come un possibile utilizzatore possa sfruttare queste classi.

Facendo girare il test abbiamo il seguente errore

```java
...
java.lang.AssertionError: No value at JSON path "$.id"
...
Caused by: java.lang.IllegalArgumentException: json can not be null or empty
...
```

Ora si sta lamentando che il nostro endpoint non restituisce nessun JSON e che quindi non può testare le varie proprietà.
Perfetto, andiamo ad implementare per far passare il test.

Modifichiamo il nostro `VehicleController`

```java
package it.mattianatali.tddspringbootapi.vehicle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VehicleController {
    private VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/api/v1/vehicles/{id}")
    Vehicle getVehicleDetails(@PathVariable Long id) {
        return vehicleService.get(id).get();
    }
}
```

Possiamo vedere per la prima volta come si può sfruttare la [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) di Spring Boot. Possiamo chiedere a Spring Boot di fornirci delle istanze di classi che ci servono per svolgere il nostro compito (in questo caso il recupero del veicolo), senza che noi dobbiamo preoccuparci effettivamente di *come* queste istanze siano create. In altre parole, tramite l'annotazione `@Autowired` stiamo dicendo a Spring Boot di fornirci nel costruttore tutte le istanze che abbiamo bisogno, delegando al framework il come crearle.

In questo modo possiamo creare delle classi disaccoppiate tra di loro e soprattutto nei test possiamo *iniettare* delle istanze finte (mockate). Iniettando nei test delle classi mockate possiamo pilotare il flusso di esecuzione senza distogliere lo sguardo dalla classe sotto test. Perchè infatti l'unica vera implementazione testata è il controller, il resto è tutta finzione (la finzione è data dall'annotazione `@MockBean` e dal metodo `when().thenReturn()`).

Dobbiamo infatti immaginare che durante il test, il controller riceve la nostra istanza mockata nel costruttore, quindi non va a toccare la vera implementazione di `VehicleService` (che per ora non esiste ancora... ritorna sempre `null`!).

Magari vi state chiedendo perchè c'è un doppio `get` in `vehicleService.get(id).get()`. Il primo è l'invocazione del nostro metodo di `VehicleService`, il secondo serve per estrapolare il valore contenuto in `Optional<Vehicle>`. È fortemente sconsigliato chiamare `get` su un opzionale perchè non stiamo gestendo affatto il caso in cui l'opzionale sia vuoto, nel nostro caso quando il veicolo non esiste. Ma per ora il nostro obiettivo è di far passare il test, poi quando faremo il test che testa il caso in cui il veicolo non esiste, lo sistemeremo.

Facendo girare il test vediamo che effettivamente funziona! Ritorniamo il JSON con tutti i campi.

### Testiamo il caso di assenza veicolo

Abbiamo testato quando il veicolo viene ritornato dal `VehicleService`, ma cosa succede quando il non esiste? Noi ci aspettiamo che l'endpoint ritorni `404 - Not Found`.

Andiamo a creare il test che verifica questo caso, nel `VehicleControllerTest` scriviamo:

```java
@Test
void getDetail_shouldReturn404IfVehicleNotFound() throws Exception {
    var vehicleId = 1L;

    when(vehicleService.get(vehicleId)).thenReturn(Optional.empty());

    mvc.perform(get("/api/v1/vehicles/" + vehicleId))
            .andExpect(status().isNotFound());
}
```

Facendo girare il test esplode in questo modo

```bash

org.springframework.web.util.NestedServletException: Request processing failed; nested exception is java.util.NoSuchElementException: No value present

	...
Caused by: java.util.NoSuchElementException: No value present
  ...
	... 57 more
```

In pratica è il nostro famoso `get` sull'opzionale che abbiamo messo nel controller. Stiamo cercando di recuperare un dato che non esiste e quindi va in eccezione.

Andiamo a modificare il controller in modo tale che ci restituisca uno status code `404` quando il service non ci restituisce alcun veicolo.
Per rispondere `404` abbiamo bisogno di un'eccezione che ci generi quello status code.
Quindi creiamo l'eccezione in  `src/main/java/it/mattianatali/tddspringbootapi/vehicle/errors/VehicleNotFoundException.java` e scriviamo

```java
package it.mattianatali.tddspringbootapi.vehicle.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class VehicleNotFoundException extends RuntimeException {
}
```

Grazie a `@ResponseStatus(HttpStatus.NOT_FOUND)` siamo sicuri che lo status code della chiamata sarà `404 - Not Found`.

Ora modifichiamo il metodo `VehicleController.getVehicleDetails`controller utilizzando questa nuova eccezione

```java
@GetMapping("/api/v1/vehicles/{id}")
Vehicle getVehicleDetails(@PathVariable Long id) {
    return vehicleService
            .get(id)
            .orElseThrow(VehicleNotFoundException::new);
}
```

In pratica abbiamo sostituito il metodo `.get` con `.orElseThrow(VehicleNotFoundException::new)`. Questo è il modo per generare un'eccezione in caso di mancato valore nell'opzionale.

Facciamo girare il test ed ora funziona tutto!

## Ricapitoliamo

Fermiamoci un secondo per fare mente locale. La strada è ancora lunga per finire l'endpoint GET. Ci manca ancora da testare ed implementare il servizio `VehicleService` e il repository `VehicleRepository`. Però ora è importante focalizzare cosa abbiamo imparato e fatto fino ad ora:

- Abbiamo creato un nuovo progetto Spring Boot utilizzando [Spring Initializr](https://start.spring.io/).
- Abbiamo migrato la suite di test a [JUnit 5](https://junit.org/junit5/).
- Abbiamo imparato ad utilizzare alcune funzionalità di [Lombok](https://projectlombok.org/).
- Abbiamo sviluppato in TDD il controller per la chiamata `GET`.
- Abbiamo imparato a sfruttare la [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) e l'annotazione `@Autowired` di Spring Boot per testare in isolamento il controller, ancor prima di aver sviluppato il servizio `VehicleService`.
- Abbiamo imparato a fare delle finte chiamate HTTP utilizzando `@WebMvcTest`.
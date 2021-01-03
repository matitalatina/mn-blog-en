---
layout: post
title: Come rimuovere i virus dal computer
image: img/virus-computer/security.jpg
author: [Mattia Natali]
date: 2016-08-07T07:03:47.149Z
tags: 
  - Malware
  - Sicurezza
  - Virus
  - Manutenzione
  - PC
  - Windows
---

"Ciao! Tutto bene? Senti penso di avere un virus nel PC, puoi darci un'occhiata?"

Le varianti di questa frase sono infinite, ma più o meno quasi la totalità delle persone che mi chiamano per avere una mano per questo problema esordiscono così.

Oggi vi spiego cosa si può fare per risolvere questo problema da soli, senza spendere un centesimo e senza neppure aver bisogno di chissà quali competenze.

## Ci sono virus e virus

Prima di iniziare è meglio sapere un minimo le varie tipologie di virus che potreste imbattervi. Secondo me è utile per capire i messaggi di errore che il vostro antivirus vi propone se trova qualcosa di insolito.

- **Malware:** è qualsiasi cosa che può recare danno al vostro pc. Quindi è la macrocategoria che contiene tutte le voci sottostranti... Infatti avrei dovuto scrivere "Ci sono malware e malware", ma vabbè ci siamo capiti!
- **Virus:** malware che è in grado di autoreplicarsi e di infettare altri utenti tramite le chiavette usb o supporti removibili.
- **Worm:** simile al virus ma infetta gli altri PC attraverso la rete.
- **Trojan:** si mostra come un software utile, in realtà apre letteralmente una porta ad un attaccante per poter rubare i vostri dati sensibili oppure prendere il possesso del vostro PC. È appunto un cavallo di Troia!
- **Spyware:** spiano ciò che fate sul PC e vendono queste informazioni sul mercato nero.
- **Adware:** vi insozzano il PC di pubblicità indesiderata.
- **Keylogger:** registrano i tasti che premete nella speranza che digitiate qualche credenziale o meglio ancora il codice della carta di credito.
- **Backdoor:** se l'attaccante riesce ad installare questa roba può utilizzare il vostro PC per fare parecchie cose in rete: per esempio inviare email o connettere il vostro PC ad un sito per sovraccaricarlo e provocare un disservizio.
- **Rootkit:** sono molto diffici da scovare, se ne avete uno è come se l'attaccante avesse il vostro pc in casa loro. Semplicemente possono fare quello che vogliono a distanza.
- **Scareware:** sono malware che vi spaventano, vi dicono che il vostro PC ha milioni di problemi e di pagare loro per sistemare tutto. Peccato che invece il vero problema è il programma stesso che finge di aiutarvi. Il più delle volte le persone si beccano questo tipo di malware.
- **Cryptolocker:** nell'ultimo periodo è stato molto in voga. In pratica, una volta avviato, comincia a criptare tutti i vostri documenti e quando ha finito vi chiede un riscatto. Se rivolete i vostri documenti dovete pagare!


## La prevenzione prima di tutto!

Premessa: io non uso **antivirus**, secondo me è possibile vivere anche senza. L'importante è stare attenti e sapere ciò che si avvia... Sempre! Se invece non vi sentite sicuri allora è meglio installare qualche antivirus che possa colmare le vostre disattenzioni *in tempo reale*. Infine se avete già un malware nel vostro PC allora **installatelo** immediatamente. Io di solito installo [Bitdefender](http://www.bitdefender.com/solutions/free.html) sui PC che sistemo. Ci sono davvero pochissime opzioni e fa il suo lavoro.
Una volta installato eseguite una **scansione completa del PC** e sperate che riesca a risolvere il vostro problema.

## Disinstallazione del malware

L'antivirus fa bene due cose: mantenere i *virus* alla larga prima che possano fare danni e rimuoverli se per caso sono già all'interno del vostro PC. Il problema è che sono molto bravi solo su una categoria, i *virus* appunto. Ma come avete letto poco tempo fa esistono una miriade di malware che non rientrano in questa categoria.
Qualora il vostro malware fosse ancora lì a darvi fastidio avete bisogno di altro... Forse anche di poco altro... Alcune volte basta veramente solo **disinstallare l'app** che vi da fastidio senza aver bisogno di chissà quali software.

Eseguire questo passo è molto semplice:

1. Leggete il nome dell'app che si apre e che vi da fastidio.
2. Andate in *Pannello di Controllo* > *Programmi e Funzionalità* > cercate il nome dell'app e disinstallatela.
3. Se per caso vi dice che l'app è in uso, chiudetela. Se non riuscite a chiuderla aprite il *task manager* premendo `ctrl`+`shift`+`esc`. Andate nella tab processi e terminate l'app in questione.

Questi passi possono variare sensibilmente in base alla versione di Windows che possedete.

## Antibiotici ad ampio spettro

Immagino che se state leggendo qui significa che il vostro bel malware vi vuole molte bene ed è ancora lì nel vostro PC a rendervi la giornata un inferno. Bene! Ora è tempo di utilizzare due software: **[Malwarebytes](https://it.malwarebytes.com/)** e **[AdwCleaner](http://www.bleepingcomputer.com/download/adwcleaner/)**.
Questi due software io li chiamo *antibiotici ad ampio spettro* proprio perchè fanno questo lavoro: cercano di togliere qualsiasi malware e quindi riescono a togliere più schifezze rispetto ad un antivirus normale.

Io vi consiglio di iniziare con Malwarebytes. [Scaricatelo](http://download.cnet.com/malwarebytes-anti-malware/windows.html?hlndr=1&part=dl-x&lang=it), installatelo (non c'è bisogno della versione premium), aggiornate il suo database e infine fate partire una scansione completa. Tutti questi passi dovrebbero essere semplici e quindi non mi dilungo troppo.
![Malwarebytes](https://mattianataliblog.s3.amazonaws.com/2016/Aug/mbam-1470564058773.png)

Finita la scansione, probabilmente avrà trovato qualcosa, seguite i passi e rimuovete ciò che ha trovato. Infine vi chiederà di riavviare il PC. Fatelo.

Ora è il momento del secondo software: **AdwCleaner**.
Anche qui i passi sono semplici. [Scaricatelo](http://www.bleepingcomputer.com/download/adwcleaner/), installatelo e infine avviatelo.
![AdwCleaner](https://mattianataliblog.s3.amazonaws.com/2016/Aug/adwcleaner_001-1470564066850.jpg)
La schermata è molto semplice: premete per prima cosa su *Scan* per avviare la scansione. Poi, una volta concluso, premete su *Clean* per avviare la pulizia. Infine vi chiederà di riavviare il PC. Anche in questo caso fate come vi dice.

## Un po' di esperienza non guasta mai

A questo punto spero che i vostri problemi siano finiti. Se invece il vostro malware è ancora lì allora è il caso di **chiamare un tecnico** perchè i tool semplici da utilizzare sono finiti e c'è bisogno di una mano esperta. Tutto quello che potete fare è salvare il salvabile e alzare la cornetta per chiedere assistenza.

## Extrema ratio

In realtà c'è ancora una *piccola* cosa che potete fare da soli, anche se è abbastanza pericolosa: potete **tentare il ripristino completo** del vostro PC.
Nel corso degli anni il ripristino del PC è diventato un processo molto semplice e secondo me è un passo che è diventato alla portata di tutti.

La cosa che dovete fare prima di tutto è **salvare i vostri dati**, e per salvare intendo su un Hard Disk esterno, unità rimovibile come una chiavetta USB. Insomma salvateli fuori dal PC per essere sicuri di non fare danni.

![Reimposta il PC - Windows 10](https://mattianataliblog.s3.amazonaws.com/2016/Aug/qindows_10_ripristino-1470564126930.png)

Se avete Windows 10 i passi sono semplici: andate in *Impostazioni* > *Aggiornamento e sicurezza* > *Reimposta il PC* > *Per iniziare* e puoi scegliere tra queste opzioni:

- **Mantieni i miei file**: magari provate per prima cosa questa opzione. In questo modo i vostri dati sono al sicuro, ma Windows 10 verrà ripristinato e verranno cancellate le vostre applicazioni.
- **Ripristina le impostazioni del produttore**: questa opzione è la più efficace perchè rende il vostro PC come nuovo.
- **Rimuovi tutto**: scegliete questa opzione nel caso non trovaste la voce precedente.

## Conclusioni

Spero che questa guida vi abbia aiutato a risolvere il vostro problemino da soli... Alla fine c'è anche una bella soddisfazione a risolvere i problemi senza l'aiuto di nessuno, no :)?
Alla prossima!
---
layout: post
title: Come giocare ai videogiochi di due o tre ere fa
image: img/old-games/Ignition.jpg
author: Mattia Natali
date: 2017-01-02T07:03:47.149Z
tags: 
  - Videogames
  - How-to
  - DOS
---

In questi giorni di vacanza mi è venuto un momento nostalgia dei vecchi, vecchissimi videogiochi degli anni '90 che giocavo sul mio primo PC, un vetusto Compaq Presario con 133MHz di CPU.

Sembra impossibile ma è ancora possibile giocare a questi videogiochi senza aver troppi problemi di compatibilità grazie a [DOSBox](http://www.dosbox.com/). Questo programma non è altro che un emulatore del sistema operativo DOS: negli anni '90 moltissimi giochi supportavano questo sistema operativo e quindi possiamo sfruttare a nostro vantaggio questa cosa.

In questa guida spiegherò come poter giocare a qualche videogioco che ha segnato la mia infanzia.

## Installiamo DOSBox

Per prima cosa bisogna installare [DOSBox](http://www.dosbox.com/), io vi consiglio di utilizzare come sistema operativo Windows... Su Mac ho qualche problema di performance... Sembra assurdo ma è così :D. L'installazione non è niente di che: basta andare nella sezione download del sito e scaricare il pacchetto ed installarlo come un comune software. Una volta ultimato questo passo siamo pronti a tuffarci nel passato!


## Grand Prix Circuit

Cominciamo ad avviare un gioco semplice semplice. [Grand Prix Circuit](https://en.wikipedia.org/wiki/Grand_Prix_Circuit_(video_game))!
<iframe width="853" height="480" src="https://www.youtube.com/embed/EJ2XmzYg-n4?rel=0" frameborder="0" allowfullscreen></iframe>

### Download

Per prima cosa dobbiamo [scaricare il gioco](http://www.bestoldgames.net/eng/old-games/grand-prix-circuit.php). Scarichiamo il pacchetto ed estraiamo i file dall'archivio `.zip` in una cartella, per esempio in `C:\giochi\gp\`.

### Mounting del volume

Ora avviamo DOSBox. Ci compare un prompt dei comandi che non è altro che la classica shell di DOS.
La prima cosa è montare il volume dove risiede il nostro gioco. In parole più semplici dobbiamo dare a DOSBox un volume `C:\`, una parte di memoria, che abbia accesso al gioco. DOSBox, senza questa operazione, non può leggere nessun dato del nostro hard disk proprio perchè i volumi (`C:\`, `D:\` ecc) che utilizza Windows sono completamenti differenti rispetto a quelli che usa DOSBox.
Per fare questa operazione basta scrivere in DOSBox

```
mount c c:\giochi\
```

Ora che abbiamo montato la nostra cartella `giochi` come volume `C`, possiamo accederci tramite DOS.

```
c:
```

Potete vedere che ora DOSBox mostra `C:\>` invece di `Z:\>` proprio perchè è all'interno del nostro volume appena creato. Sostanzialmente ora in DOSBox siamo nella cartella `C:\giochi\` del nostro PC.

### Avvio del gioco
Ora utilizziamo un'altro comando DOS:

```
dir
```

questo comando mostra tutti i file e le cartelle contenute nel path in cui ci troviamo. Dovrebbe comparire la nostra cartella `gp`. Per accederci utilizziamo il comando

```
cd gp
```

Ora siamo nella cartella dove è presente Grand Prix Circuit appena scaricato. Per avviare il gioco con ci resta che eseguire il comando

```
GP.EXE
```

Complimenti! Ora potete divertirvi a giocare ad un super gioco che ha fatto la storia!

### Riassunto

Bene, fin qui abbiamo imparato a fare le seguenti cose:

1. Download del gioco e avvio di DOSBox.
1. Mounting della directory `giochi` per offrire a DOSBox una parte di memoria del nostro PC.
1. Navigazione tra le cartelle in DOS tramite i comandi `cd` `dir`. Questa guida non vuole insegnare ad utilizzare questo sistema operativo e quindi sono stato abbastanza sbrigativo. Se volete saperne di più potete [documentarvi tramite questo link](http://www.myw0.com/2010/1635/list-of-dos-commands-cheat-sheet-for-dos/).
1. Avvio del gioco.

Questi passi vanno bene per buona parte dei vecchi videogiochi, ma ce ne sono altri che richiedono l'installazione oppure l'inserimento del CD-ROM per poter giocare. Il prossimo gioco rientra proprio in questa casistica.

## Ignition

Questo gioco mi piace davvero parecchio! Mi ricorda le ore passate insieme a mio cugino parecchi anni fa!

<iframe width="853" height="480" src="https://www.youtube.com/embed/f2lajsZt4Hg?rel=0" frameborder="0" allowfullscreen></iframe>

La modalità di avvio è simile alla precedente, solo che in questo caso dobbiamo installare il gioco come se avessimo un CD-ROM.

### Download

[Scarichiamo il gioco](http://www.bestoldgames.net/eng/old-games/ignition.php) ed estraiamo l'archivio in `C:\giochi\ign\`.

### Mounting dei volumi

Montiamo il volume `C:` con lo stesso comando usato in precedenza

```
mount c: c:\giochi\
```

Ora inseriamo il CD-ROM di Ignition! In che modo? Più o meno come si monta un classico volume.

```
mount d: c:\giochi\ign\ -t cdrom
```

In questo caso stiamo dicendo a DOSBox di mostrare la nostra cartella `c:\giochi\ign\`, dove c'è dentro il gioco scaricato, come se fosse un CD-ROM.


### Installazione

Ora entriamo nel CD e avviamo l'installazione

```
d:
DOS_INST.EXE
```

A questo punto partirà l'installazione. Scegliete italiano e premete sempre avanti.

### Avvio del gioco

Ora siamo pronti per giocare. Scrivete questi tre comandi e buon divertimento!

```
c:
cd IGNITION
IGN_DOS.BAT
```

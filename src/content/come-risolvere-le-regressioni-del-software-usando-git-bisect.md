---
layout: post
title: Come risolvere le regressioni del software usando git bisect
image: img/git-bisect/fail.jpg
author: Mattia Natali
date: 2018-01-15T07:03:47.149Z
tags: 
  - Dev
  - How-to
  - Terminale
---

Avevete aggiunto una funzionalità al software ed è andata in produzione. Dopo qualche settimana il Product Owner vi comunica che non funziona più. Don't panic. Usando solamente [Git](https://it.wikipedia.org/wiki/Git_(software)) si può risolvere tutto in pochi minuti!

**A tutti può capitare una [regressione del software](https://en.wikipedia.org/wiki/Software_regression)** e non è mai piacevole. Ho visto molti sviluppatori che, in un caso come questo, cominciano a tentare di riprodurre il bug in locale e a rileggere furiosamente il codice nella speranza di risolvere il bug. Se nel codice ci lavorano molte mani, **la ricerca del bug può essere tutt'altro che semplice**.

Usando quest'approccio naive **non stiamo sfruttando tutte le nostre informazioni in possesso**: noi *siamo certi* che la funzionalità *prima* funzionava correttamente. Quindi è successo qualcosa nel mentre che ha sicuramente rotto la nostra parte di codice. Quindi perchè cercare questa modifica manualmente quando Git può fare il lavoro sporco per noi in pochissimi passaggi? **Git può dirci puntualmente *cosa* è successo, *quando*, *chi* è stato e *perchè*** (se lo sviluppatore che ha introdotto il bug ha scritto un testo decente nel commit).

## git bisect

Ebbene sì, Git offre proprio questa funzionalità. Non tutti la sfruttano ma in casi come questi è potentissima. È il comando **[`git bisect`](https://git-scm.com/docs/git-bisect)**.

Per farla breve, si definiscono due commit: il primo è un commit "buggato", ossia che presenta il problema, il secondo è un commit sano, dove il problema non esisteva ancora. Git poi mostra un commit che sta nel mezzo e sta a noi a dire a Git se funziona o no. Git a questo punto mostra un altro commit che sta sempre nel mezzo tra il commit buggato e quello sano. Si va avanti così finchè Git ci mostra il commit che ha introdotto il bug.

Sembra un procedimento lunghissimo ma non lo è: infatti, ad ogni nostra verifica, dimezziamo il numero di commit tra quello buono e quello buggato. Per esempio se abbiamo 1000 commit che separano i nostri due commit di riferimento, noi troviamo quello che ha introdotto il problema in log_2(1000) ~ 10 passi!

## Esempio pratico

Come esempio ho usato un [mio piccolo progetto](http://8ball.mattianatali.it) che avevo creato per imparare un po' di concetti su [React](https://reactjs.org/). Supponiamo che vogliamo sapere chi ha aggiunto l'effetto particellare alla pagina.
Durante il procedimento di `git bisect` etichettiamo come `bad` tutte le volte che il progetto ha la cartella `src/components/atoms/ParticlesBackground`. Mentre tutti i commit che non la possiedono saranno `good`.

![git-bisect-app-preview](https://s3-eu-west-1.amazonaws.com/mattianataliblog/2018/01/git-bisect-app-preview.png)

Iniziamo! Per prima cosa cloniamo il progetto ed entriamoci dentro con il terminale.

```
git clone https://github.com/matitalatina/8ball
cd 8ball
```

Ora iniziamo la ricerca

```
git bisect start
```

Avviando il programma notiamo che il branch `master` ha la cartella `src/components/atoms/ParticlesBackground`. Quindi etichettiamo il commit come `bad`.

```
git bisect bad
```

Poi torniamo indietro nella storia di Git abbastanza da non trovare più la cartella in questione. Nel nostro caso tornare indietro di 10 commit è sufficiente.

```
git checkout HEAD~10
```

Ok! Ora la cartella è sparita! Quindi possiamo etichettarlo come `good`.

```
git bisect good
```

Ora Git cambierà commit e si porterà esattamente in un punto a metà tra i commit etichettati come `good` e `bad`. Ve lo notifica con la seguente dicitura.

```
Bisecting: 5 revisions left to test after this (roughly 3 steps)
[5e2a30980acb38d3d3958359c56fd0a8d0325136] Improve particles system
```

Andate avanti a scrivere `git bisect good` o `git bisect bad` finchè avrete analizzato circa 4 passi.

Nel nostro caso specifico sarà:

```
git bisect bad
git bisect good
git bisect bad
git bisect good
```

Alla fine, quando Git ha individuato il commit che stavamo cercando, ve lo comunica in questo modo:

```
b7b5d042a8cba637c56cc52401dcd61ec785d9b4 is the first bad commit
commit b7b5d042a8cba637c56cc52401dcd61ec785d9b4
Author: Mattia Natali <***@***.***>
Date:   Mon Nov 6 22:24:32 2017 +0100

    Add particles

:100644 100644 d93738e6743c2460699030cfe8df000e1bc7ecd7 570e0890ece45c8d4ef6640a3ea7a386fd63f7da M	package-lock.json
:100644 100644 994aebed4cf0ebfb0dd56e2bebf2a6e411e44e1c 0dc0290897d7082dadda14595739b80b07766603 M	package.json
:040000 040000 9f912726175c5d9794d00deffdb422136555846f a934e7f36f14c1ec38058bfbfbf403d3fb8043b3 M	src
```

![git-bisect-terminal](https://s3-eu-west-1.amazonaws.com/mattianataliblog/2018/01/git-bisect-terminal.png)

Già il messaggio del commit ci fa intuire che Git ha fatto centro ("Add particles")! Ma noi non ci fidiamo e allora vediamo effettivamente cosa è stato fatto in questo commit: prendiamo l'id del commit (`b7b5d042a8cba637c56cc52401dcd61ec785d9b4`) e scriviamo:

```
git show b7b5d042a8cba637c56cc52401dcd61ec785d9b4
```

scorrendo il commit notiamo la parte

```
diff --git a/src/components/atoms/ParticlesBackground/index.js b/src/components/atoms/ParticlesBackground/index.js
new file mode 100644
index 0000000..748f50d
--- /dev/null
+++ b/src/components/atoms/ParticlesBackground/index.js
@@ -0,0 +1,129 @@
+import Particles from 'react-particles-js'
+import styled from 'styled-components'
+import React from 'react'
+
+const Wrapper = styled.div`
+  pointer-events: none;
+  position: fixed;
+  top: 0;
+  bottom: 0;
+  left: 0;
+  right: 0;
...
```

che è proprio la parte che stavamo cercando! Quindi in definitiva ora sappiamo che Mattia Natali ha aggiunto questa parte il Lunedì 6 Novembre 2017 alle 22:24.


## Conclusioni

Immaginate ora di farlo per un bug che vi sta facendo impazzire, è molto potente perchè vi indica esattamente chi è stato e cosa è stato cambiato. In questo modo potete chiedere chiarimenti all'autore del commit e sapere esattamente la modifica che ha creato il bug.

Magari `git bisect` non vi servirà tutti i giorni, ma è giusto tenerlo a mente perchè è sicuro che **prima o poi vi tornerà utile** e vi farà risparmiare un sacco di tempo.

Alla prossima!

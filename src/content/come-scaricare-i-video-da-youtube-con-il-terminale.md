---
layout: post
title: Come scaricare i video da YouTube con il terminale
excerpt: Avete appena trovato un video bellissimo su YouTube e volete a tutti i costi scaricarlo, oppure volete scaricare solo la parte audio del video per inserirlo nella vostra playlist musicale? Siete pure anche Nerd inside? Bene, allora questa guida fa per voi!
image: img/youtube-download/youtube-terminal.jpg
author: [Mattia Natali]
date: 2017-09-17T15:10:47.149Z
tags: 
  - Terminale
  - Mac
  - YouTube
---

Avete appena trovato un video bellissimo su YouTube e volete a tutti i costi scaricarlo, oppure volete scaricare solo la parte audio del video per inserirlo nella vostra playlist musicale? Il terminale non vi spaventa? Bene, allora questa guida fa per voi!

Ci sono un sacco di siti online che fanno queste cose: pieni di pubblicità, a volte non funzionano neanche e solitamente danno pochissima possibilità di personalizzazione su cosa scaricare. Io mi sono stancato di appoggiarmi a questi programmi esterni e ho deciso di fare tutto "in casa".

Questa guida si basa sul sistema operativo Mac OS. Ma con piccoli accorgimenti è possibile seguirla anche per Windows e Linux dato che i programmi che utilizzerò sono multi piattaforma.

# Preparazione

Sostanzialmente per raggiungere lo scopo servono 3 programmi:

* **[Homebrew](https://brew.sh/index_it.html)**: il miglior gestore di applicazioni per il Mac. Con questo software sarà una passeggiata installare gli altri due.
* **[Ffmpeg](https://www.ffmpeg.org/)**: quando si parla di conversione audio/video lui è il punto di riferimento. Gratis, open source, cross platform, potente... Cosa chiedere di più?
* **[Youtube-dl](https://github.com/rg3/youtube-dl)**: il programma che fa il lavoro sporco di scaricare il video da YouTube.

## Installazione

Ora che sappiamo cosa ci serve procediamo con le installazioni di questi software!

1. Apriamo il terminale del Mac.
1. Installiamo Homebrew 
    ```
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
1. Installiamo Ffmpeg
    ```
    brew install ffmpeg --with-fdk-aac --with-tools --with-freetype --with-libass --with-libvorbis --with-libvpx --with-x265
    ```
1. Installiamo Youtube-dl
    ```
    brew install youtube-dl
    ```

Bene! Ora abbiamo tutto l'occorrente per scaricare tutti i video di YouTube che vogliamo!

# Si inizia!

Come esempio utilizzerò il video di Gigi D'Agostino che ha appena caricato online. Vi consiglio di vederlo ed ascoltarlo: la sobrietà delle sue pellicole non ha eguali :D!

<iframe width="560" height="315" src="https://www.youtube.com/embed/UyyxYha4j6o" frameborder="0" allowfullscreen></iframe>


## Modalità automatica

Partiamo dalla cosa più semplice: scaricare il video senza perdere troppo tempo!

1. Andiamo su YouTube, apriamo il video e copiamo l'URL. Nel nostro caso è https://www.youtube.com/watch?v=UyyxYha4j6o.
1. Apriamo il terminale e scriviamo `youtube-dl ` e incolliamo l'url del punto precedente. Quindi
    ```
    youtube-dl https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```
    noterete che copiando vengono aggiunti dei `\` prima di `?` e `=`. Non preoccupatevi, sono dei caratteri di escaping che sono necessari e che il terminale aggiunge automaticamente.
1. Attendiamo ed è fatta! Nella cartella in cui ci troviamo avremo il video!


## Scegliere il formato video

Ok Ok, forse il formato scaricato non vi aggrada o ne volete uno con minor qualità... Per far questo scrivete:

1. Aggiungiamo l'opzione `-F` che ci mostra tutti i formati disponibili
    ```
    youtube-dl -F https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```
1. Avremo una bella lista di formati disponibili. Scegliamo quello che più ci aggrada e prendiamo nota del `format code`.
1. Per scaricare la versione scelta ci basterà aggiungere `-f <format_code>` dove `<format_code>` è il codice scelto nel punto precedente. Quindi, per esempio, se volessimo scaricare la versione
    ```
    299          mp4        1920x1080  DASH video 5820k , avc1.64002a, 50fps, video only, 274.09MiB
    ```
    ci basterà scrivere.
    ```
    youtube-dl -f 299 https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```


## Estrarre la traccia audio

Per avere solo la traccia audio ci basta scegliere il format code che ha nella colonna `resolution` `audio only`. Nel nostro video se mostriamo la lista dei formati disponibili possiamo notare che ci sono queste tracce audio
```
format code  extension  resolution note
139          m4a        audio only DASH audio   48k , m4a_dash container, mp4a.40.5@ 48k (22050Hz), 2.26MiB
249          webm       audio only DASH audio   62k , opus @ 50k, 2.39MiB
250          webm       audio only DASH audio   79k , opus @ 70k, 3.16MiB
140          m4a        audio only DASH audio  128k , m4a_dash container, mp4a.40.2@128k (44100Hz), 6.03MiB
171          webm       audio only DASH audio  152k , vorbis@128k, 6.18MiB
251          webm       audio only DASH audio  153k , opus @160k, 6.24MiB
```

Molto probabilmente il formato audio non è quello che vogliamo. Quindi abbiamo bisogno una conversione audio. Youtube-dl utilizza ffmpeg per effettuare la conversione.
Per esempio se volessivo avere un file audio con formato `.m4a` con un bitrate di `160k` ci basterà scrivere
```
youtube-dl -x --audio-format m4a --audio-quality 160k https://www.youtube.com/watch\?v\=UyyxYha4j6o
```
Dove le opzioni significano

* **-x**: estrai la traccia audio dal video.
* **--audio-format m4a**: il formato da scaricare, o da convertire se non presente nella lista, è m4a. I formati disponibili sono `"best", "aac", "flac", "mp3", "m4a", "opus", "vorbis", "wav"`.
* **--audio-quality 160k**: bitrate della traccia audio desiderato.

## Scaricare più video o una playlist

Ora che sappiamo come scaricare un video nel formato perfetto per noi, perchè non applicare le stesse impostazioni per più video in un colpo? È semplicissimo! Basta aggiungere più url nel nostro terminale separati da uno spazio. Per esempio possiamo scrivere
```
youtube-dl -x --audio-format m4a --audio-quality 160k https://www.youtube.com/watch\?v\=UyyxYha4j6o https://www.youtube.com/watch\?v\=6L5a3Qt7cvg
```
per avere entrambi i video trasformati in traccia audio.

Se invece volessimo scaricare una playlist invece di un singolo video ci basta inserire l'URL della playlist!


## Semplifichiamoci la vita con gli alias

Quando voglio scaricare le canzoni da YouTube, di solito uso sempre le stesse impostazioni. E scrivere ogni volta `youtube-dl -x --audio-format m4a --audio-quality <URL>` è una rottura oltre che difficile da ricordare. Sarebbe molto meglio se si potesse scrivere solamente `yda <URL>` (`yda` sta per Youtube Download Audio). La buona notizia è che si può fare!

Apriamo il terminale e inseriamo
```
echo "alias yda='youtube-dl -x --audio-format m4a --audio-quality 160k'" | tee -a ~/.bash_profile && source !$
```

Cosa fa questo comando?
* `echo "alias yda='youtube-dl -x --audio-format m4a --audio-quality 160k'" | tee -a ~/.bash_profile`: scrivi il nuovo alias in fondo al file `~/.bash_profile`. In questo modo, ogni volta che apririamo un nuovo terminale avremo questo alias pronto all'uso.
* `&& source !$`: dopo aver scritto il nuovo alias ricarica il file `~/.bash_profile` nel terminale, in modo da avere il nuovo alias disponibile anche nel terminale corrente.

Ora, se vogliamo scaricare una qualsiasi canzone da YouTube sarà semplicissimo.

1. Cerchiamo il video su YouTube, copiate l'url.
1. Apriamo il terminale e scriviamo `yda <URL>`.
1. Fine!


## Voglio saperne di più!

Youtube-dl non ha solo queste impostazioni, queste sono solamente quelle che utilizzo io. Se volete saperne di più vi basta scrivere `youtube-dl --help`. In questo modo avrete tutte, ma proprio tutte, le impostazioni di questo programma e vi assicuro che sono tantissime!


# Conclusioni

Spero che questa guida vi abbia dato uno strumento in più per poter scaricare i video di YouTube a voi più cari, senza aver bisogno di siti online pieni di pubblicità che funzionano una volta sì e dieci no.
Inoltre spero che ora abbiate intuito le potenzialità del terminale, applicazione usata giornalmente dagli sviluppatori, ma snobbata ingiustamente da molti!

Alla prossima!

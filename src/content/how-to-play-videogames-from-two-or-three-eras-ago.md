---
layout: post
title: How to play videogames from two or three eras ago
image: img/old-games/Ignition.jpg
author: [Mattia Natali]
date: 2017-01-02T07:03:47.149Z
tags: 
  - Videogames
  - How-to
  - DOS
draft: false
---

During these holidays I got a moment of nostalgia for the old, very old videogames from the '90s that I used to play on my first PC, an ancient Compaq Presario with a 133MHz CPU.

It seems impossible but it's still possible to play these videogames without too many compatibility problems thanks to [DOSBox](http://www.dosbox.com/). This program is nothing more than an emulator of the DOS operating system: in the '90s many games supported this operating system and so we can take advantage of that.

In this guide I'll explain how to play some videogames that marked my childhood.

## Let's install DOSBox

First of all you need to install [DOSBox](http://www.dosbox.com/); I recommend using Windows as the operating system... On Mac I have some performance problems... It seems absurd but that's how it is :D. The installation is nothing special: just go to the download section of the website and download the package and install it like any common software. Once this step is done we're ready to dive into the past!


## Grand Prix Circuit

Let's start with a very simple game. [Grand Prix Circuit](https://en.wikipedia.org/wiki/Grand_Prix_Circuit_(video_game))!
<iframe width="853" height="480" src="https://www.youtube.com/embed/EJ2XmzYg-n4?rel=0" frameborder="0" allowfullscreen></iframe>

### Download

First we need to [download the game](http://www.bestoldgames.net/eng/old-games/grand-prix-circuit.php). Download the package and extract the files from the `.zip` archive into a folder, for example `C:\games\gp\`.

### Mounting the volume

Now let's start DOSBox. A command prompt appears, which is nothing more than the classic DOS shell.
The first thing to do is mount the volume where our game lives. In simpler words we need to give DOSBox a `C:\` volume, a portion of memory, that has access to the game. Without this operation DOSBox can't read any data from our hard disk precisely because the volumes (`C:\`, `D:\` etc.) that Windows uses are completely different from the ones DOSBox uses.
To do this operation just type in DOSBox

```
mount c c:\games\
```

Now that we've mounted our `games` folder as volume `C`, we can access it through DOS.

```
c:
```

You can see that now DOSBox shows `C:\>` instead of `Z:\>` precisely because it's inside our newly created volume. Basically now in DOSBox we're in the `C:\games\` folder of our PC.

### Starting the game
Now let's use another DOS command:

```
dir
```

this command shows all the files and folders contained in the path we're in. Our `gp` folder should appear. To access it we use the command

```
cd gp
```

Now we're in the folder where the Grand Prix Circuit we just downloaded is. To start the game we just need to run the command

```
GP.EXE
```

Congratulations! Now you can have fun playing a great game that made history!

### Summary

Good, so far we've learned to do the following things:

1. Download the game and start DOSBox.
1. Mount the `games` directory to give DOSBox a portion of memory from our PC.
1. Navigate between folders in DOS using the `cd` and `dir` commands. This guide doesn't aim to teach you how to use this operating system so I've been quite brief. If you want to know more you can [read up via this link](http://www.myw0.com/2010/1635/list-of-dos-commands-cheat-sheet-for-dos/).
1. Start the game.

These steps work for a good part of the old videogames, but there are others that require installation or inserting the CD-ROM to play. The next game falls exactly into this case.

## Ignition

I really like this game a lot! It reminds me of the hours spent with my cousin many years ago!

<iframe width="853" height="480" src="https://www.youtube.com/embed/f2lajsZt4Hg?rel=0" frameborder="0" allowfullscreen></iframe>

The startup mode is similar to the previous one, except that in this case we need to install the game as if we had a CD-ROM.

### Download

[Let's download the game](http://www.bestoldgames.net/eng/old-games/ignition.php) and extract the archive into `C:\games\ign\`.

### Mounting the volumes

Let's mount the `C:` volume with the same command used before

```
mount c: c:\games\
```

Now let's insert the Ignition CD-ROM! How? More or less like mounting a classic volume.

```
mount d: c:\games\ign\ -t cdrom
```

In this case we're telling DOSBox to show our `c:\games\ign\` folder, where the downloaded game is, as if it were a CD-ROM.


### Installation

Now let's enter the CD and start the installation

```
d:
DOS_INST.EXE
```

At this point the installation will start. Choose your language and keep pressing next.

### Starting the game

Now we're ready to play. Type these three commands and have fun!

```
c:
cd IGNITION
IGN_DOS.BAT
```

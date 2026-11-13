---
layout: post
title: How to remove viruses from your computer
image: img/virus-computer/security.jpg
author: [Mattia Natali]
date: 2016-08-07T07:03:47.149Z
tags: 
  - Malware
  - Security
  - Virus
  - Maintenance
  - PC
  - Windows
draft: false
---

"Hi! How are you? Listen, I think I have a virus on my PC, can you take a look at it?"

The variations of this sentence are endless, but more or less almost all the people who call me to get a hand with this problem start like that.

Today I'll explain what you can do to solve this problem on your own, without spending a penny and without even needing any special skills.

## There are viruses and viruses

Before starting, it's better to know at least a little about the various types of viruses you might run into. In my opinion it's useful to understand the error messages your antivirus shows you when it finds something unusual.

- **Malware:** this is anything that can harm your PC. So it's the macro category that contains all the entries below... In fact I should have written "There are malware and malware", but whatever, you get the idea!
- **Virus:** malware that is able to self-replicate and infect other users through USB sticks or removable media.
- **Worm:** similar to a virus but it infects other PCs through the network.
- **Trojan:** it shows up as useful software, but in reality it literally opens a door for an attacker to steal your sensitive data or take control of your PC. It really is a Trojan horse!
- **Spyware:** spies on what you do on your PC and sells this information on the black market.
- **Adware:** fills your PC with unwanted advertising.
- **Keylogger:** records the keys you press hoping you type some credentials or, even better, your credit card number.
- **Backdoor:** if the attacker manages to install this stuff, they can use your PC to do several things on the network: for example send emails or connect your PC to a website to overload it and cause an outage.
- **Rootkit:** these are very hard to find; if you have one it's as if the attacker had your PC in their house. They can simply do whatever they want remotely.
- **Scareware:** these are malware that scare you, telling you that your PC has millions of problems and that you should pay them to fix everything. Too bad the real problem is the program itself pretending to help you. Most of the time people catch this type of malware.
- **Cryptolocker:** it has been very popular recently. Basically, once started, it begins to encrypt all your documents and when it's done it asks you for a ransom. If you want your documents back you have to pay!


## Prevention above all!

Disclaimer: I don't use **antivirus**, in my opinion it's possible to live without it too. The important thing is to be careful and know what you're starting... Always! If instead you don't feel safe, then it's better to install some antivirus that can cover your distractions *in real time*. Finally, if you already have malware on your PC then **install it** immediately. I usually install [Bitdefender](http://www.bitdefender.com/solutions/free.html) on the PCs I fix. There are really very few options and it does its job.
Once installed, run a **full scan of the PC** and hope it manages to solve your problem.

## Uninstalling the malware

The antivirus does two things well: keeping *viruses* away before they can do damage and removing them if they happen to already be inside your PC. The problem is that they are only very good at one category, *viruses* precisely. But as you read a moment ago, there are a myriad of malware that don't fall into this category.
If your malware is still there bothering you, you need something else... Maybe even just a little something else... Sometimes all it really takes is **uninstalling the app** that's bothering you without needing any special software.

Doing this step is very simple:

1. Read the name of the app that opens and bothers you.
2. Go to *Control Panel* > *Programs and Features* > look for the app name and uninstall it.
3. If it happens to tell you the app is in use, close it. If you can't close it, open the *task manager* by pressing `ctrl`+`shift`+`esc`. Go to the processes tab and terminate the app in question.

These steps can vary significantly depending on the version of Windows you have.

## Broad-spectrum antibiotics

I imagine that if you're reading here it means your dear malware loves you very much and is still there on your PC making your day hell. Good! Now it's time to use two pieces of software: **[Malwarebytes](https://www.malwarebytes.com/)** and **[AdwCleaner](http://www.bleepingcomputer.com/download/adwcleaner/)**.
I call these two pieces of software *broad-spectrum antibiotics* precisely because that's what they do: they try to remove any malware and therefore manage to remove more junk than a normal antivirus.

I recommend starting with Malwarebytes. [Download it](http://download.cnet.com/malwarebytes-anti-malware/windows.html?hlndr=1&part=dl-x&lang=en), install it (you don't need the premium version), update its database and finally run a full scan. All these steps should be simple so I won't dwell on them too much.
![Malwarebytes](https://mattianataliblog.s3.amazonaws.com/2016/Aug/mbam-1470564058773.png)

Once the scan is finished, it has probably found something; follow the steps and remove what it found. Finally it will ask you to restart the PC. Do it.

Now it's time for the second piece of software: **AdwCleaner**.
Here too the steps are simple. [Download it](http://www.bleepingcomputer.com/download/adwcleaner/), install it and finally start it.
![AdwCleaner](https://mattianataliblog.s3.amazonaws.com/2016/Aug/adwcleaner_001-1470564066850.jpg)
The screen is very simple: first press *Scan* to start the scan. Then, once it's done, press *Clean* to start the cleaning. Finally it will ask you to restart the PC. In this case too, do as it says.

## A little experience never hurts

At this point I hope your problems are over. If instead your malware is still there then it's time to **call a technician** because the easy-to-use tools are finished and an expert hand is needed. All you can do is save what can be saved and pick up the phone to ask for help.

## Last resort

Actually there is still one *small* thing you can do on your own, even though it's quite dangerous: you can **attempt a full reset** of your PC.
Over the years resetting a PC has become a very simple process and in my opinion it's a step that has become within everyone's reach.

The first thing you must do is **save your data**, and by save I mean to an external hard drive, a removable drive such as a USB stick. In short, save it outside the PC to be sure you don't do any damage.

![Reset this PC - Windows 10](https://mattianataliblog.s3.amazonaws.com/2016/Aug/qindows_10_ripristino-1470564126930.png)

If you have Windows 10 the steps are simple: go to *Settings* > *Update & Security* > *Reset this PC* > *Get started* and you can choose between these options:

- **Keep my files**: maybe try this option first. This way your data is safe, but Windows 10 will be reset and your applications will be deleted.
- **Restore factory settings**: this option is the most effective because it makes your PC like new.
- **Remove everything**: choose this option if you can't find the previous entry.

## Conclusions

I hope this guide helped you solve your little problem on your own... In the end there's also a nice satisfaction in solving problems without anyone's help, right :)?
See you next time!

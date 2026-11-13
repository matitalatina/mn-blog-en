---
layout: post
title: How to download YouTube videos with the terminal
excerpt: You've just found a beautiful video on YouTube and you absolutely want to download it, or you want to download only the audio part of the video to add it to your music playlist? Are you also a Nerd inside? Good, then this guide is for you!
image: img/youtube-download/youtube-terminal.jpg
author: [Mattia Natali]
date: 2017-09-17T15:10:47.149Z
tags: 
  - Terminal
  - Mac
  - YouTube
draft: false
---

You've just found a beautiful video on YouTube and you absolutely want to download it, or you want to download only the audio part of the video to add it to your music playlist? The terminal doesn't scare you? Good, then this guide is for you!

There are a lot of online sites that do these things: full of ads, sometimes they don't even work and usually they give very little customization on what to download. I got tired of relying on these external programs and decided to do everything "at home".

This guide is based on the Mac OS operating system. But with small adjustments it's possible to follow it on Windows and Linux too, since the programs I'll use are multi-platform.

# Preparation

Basically to achieve the goal we need 3 programs:

* **[Homebrew](https://brew.sh/index_en.html)**: the best application manager for Mac. With this software installing the other two will be a walk in the park.
* **[Ffmpeg](https://www.ffmpeg.org/)**: when it comes to audio/video conversion it's the reference point. Free, open source, cross platform, powerful... What more could you ask for?
* **[Youtube-dl](https://github.com/rg3/youtube-dl)**: the program that does the dirty work of downloading the video from YouTube.

## Installation

Now that we know what we need, let's proceed with installing these programs!

1. Let's open the Mac terminal.
1. Let's install Homebrew 
    ```
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
1. Let's install Ffmpeg
    ```
    brew install ffmpeg --with-fdk-aac --with-tools --with-freetype --with-libass --with-libvorbis --with-libvpx --with-x265
    ```
1. Let's install Youtube-dl
    ```
    brew install youtube-dl
    ```

Good! Now we have everything we need to download all the YouTube videos we want!

# Let's start!

As an example I'll use the video by Gigi D'Agostino that he just uploaded online. I recommend watching and listening to it: the sobriety of his films is unmatched :D!

<iframe width="560" height="315" src="https://www.youtube.com/embed/UyyxYha4j6o" frameborder="0" allowfullscreen></iframe>


## Automatic mode

Let's start with the simplest thing: downloading the video without wasting too much time!

1. Let's go to YouTube, open the video and copy the URL. In our case it's https://www.youtube.com/watch?v=UyyxYha4j6o.
1. Let's open the terminal and type `youtube-dl ` and paste the URL from the previous step. So
    ```
    youtube-dl https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```
    you'll notice that when pasting, some `\` are added before `?` and `=`. Don't worry, they are escape characters that are necessary and that the terminal adds automatically.
1. Let's wait and it's done! In the folder we're in we'll have the video!


## Choosing the video format

Ok Ok, maybe you don't like the downloaded format or you want one with lower quality... To do this type:

1. Let's add the `-F` option which shows us all the available formats
    ```
    youtube-dl -F https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```
1. We'll have a nice list of available formats. Let's choose the one we like best and take note of the `format code`.
1. To download the chosen version we just need to add `-f <format_code>` where `<format_code>` is the code chosen in the previous step. So, for example, if we wanted to download the version
    ```
    299          mp4        1920x1080  DASH video 5820k , avc1.64002a, 50fps, video only, 274.09MiB
    ```
    we'd just type.
    ```
    youtube-dl -f 299 https://www.youtube.com/watch\?v\=UyyxYha4j6o
    ```


## Extracting the audio track

To get only the audio track we just need to choose the format code that has `audio only` in the `resolution` column. In our video, if we show the list of available formats we can notice that there are these audio tracks
```
format code  extension  resolution note
139          m4a        audio only DASH audio   48k , m4a_dash container, mp4a.40.5@ 48k (22050Hz), 2.26MiB
249          webm       audio only DASH audio   62k , opus @ 50k, 2.39MiB
250          webm       audio only DASH audio   79k , opus @ 70k, 3.16MiB
140          m4a        audio only DASH audio  128k , m4a_dash container, mp4a.40.2@128k (44100Hz), 6.03MiB
171          webm       audio only DASH audio  152k , vorbis@128k, 6.18MiB
251          webm       audio only DASH audio  153k , opus @160k, 6.24MiB
```

Very likely the audio format isn't the one we want. So we need an audio conversion. Youtube-dl uses ffmpeg to perform the conversion.
For example if we wanted an audio file in `.m4a` format with a bitrate of `160k` we'd just type
```
youtube-dl -x --audio-format m4a --audio-quality 160k https://www.youtube.com/watch\?v\=UyyxYha4j6o
```
Where the options mean

* **-x**: extract the audio track from the video.
* **--audio-format m4a**: the format to download, or to convert if not present in the list, is m4a. The available formats are `"best", "aac", "flac", "mp3", "m4a", "opus", "vorbis", "wav"`.
* **--audio-quality 160k**: desired audio track bitrate.

## Downloading multiple videos or a playlist

Now that we know how to download a video in the perfect format for us, why not apply the same settings to multiple videos at once? It's very simple! Just add more URLs in our terminal separated by a space. For example we can type
```
youtube-dl -x --audio-format m4a --audio-quality 160k https://www.youtube.com/watch\?v\=UyyxYha4j6o https://www.youtube.com/watch\?v\=6L5a3Qt7cvg
```
to have both videos converted into audio tracks.

If instead we wanted to download a playlist instead of a single video we just need to insert the playlist URL!


## Making our life easier with aliases

When I want to download songs from YouTube, I usually always use the same settings. And typing `youtube-dl -x --audio-format m4a --audio-quality <URL>` every time is a pain as well as hard to remember. It would be much better if you could just type `yda <URL>` (`yda` stands for Youtube Download Audio). The good news is that you can!

Let's open the terminal and enter
```
echo "alias yda='youtube-dl -x --audio-format m4a --audio-quality 160k'" | tee -a ~/.bash_profile && source !$
```

What does this command do?
* `echo "alias yda='youtube-dl -x --audio-format m4a --audio-quality 160k'" | tee -a ~/.bash_profile`: write the new alias at the bottom of the `~/.bash_profile` file. This way, every time we open a new terminal we'll have this alias ready to use.
* `&& source !$`: after writing the new alias, reload the `~/.bash_profile` file in the terminal, so that the new alias is available in the current terminal too.

Now, if we want to download any song from YouTube it will be very simple.

1. Let's search for the video on YouTube, copy the URL.
1. Let's open the terminal and type `yda <URL>`.
1. Done!


## I want to know more!

Youtube-dl doesn't only have these settings, these are just the ones I use. If you want to know more just type `youtube-dl --help`. This way you'll have all, but really all, the settings of this program and I assure you there are a lot of them!


# Conclusions

I hope this guide has given you one more tool to download the YouTube videos you care about most, without needing online sites full of ads that work once in a while.
I also hope that now you've grasped the potential of the terminal, an application used daily by developers, but unjustly snubbed by many!

See you next time!

---
layout: post
title: How to store secrets in public repositories
excerpt: Is it possible in a secure way? The answer is yes!
image: img/angular-jwt-auth/angular-jwt-rxjs.jpg
author: [Mattia Natali]
date: 2019-12-15T16:40:20.172Z
tags: 
  - Dev
  - Auth
  - How-to
draft: true
---

We all feel this pain sooner or later: you are working hard on your git repository. For whatever reason, you change the PC but you still want to work on your project.
So you download the repo using `git clone`. You're ready to go, but then you're stuck, because you don't remember the secrets that you put in your `.gitignore` file.

Luckily now there's a solution for that. And it's called [git-crypt](https://www.agwa.name/projects/git-crypt/).

Git-crypt will encrypt your secrets before the pushing your changes on your remote branch, and it decrypt them when you download from it. So after you setup it, everything is completely transparent. You will forget to have secrets in your repo!

## Bootstrap

To start with it, you need to install it. On Mac you can run the following command in the terminal, after you installed the package manager [brew](https://brew.sh/)

```bash
brew install git-crypt
```

Then, you need to go to your public repository that you want to put secrets. And initialize `git-crypt`

```bash
cd <YOUR_REPO_PATH>
git-crypt init
```

## Add secrets

Now you need to add the `.gitattribute` file in the repository's root folder. In this file you declare the files and folders you want to keep secret.
This is an example of `.gitattribute` file

```bash
# Make the file .env secret
.env filter=git-crypt diff=git-crypt

# Make all files that ends with .key secret
*.key filter=git-crypt diff=git-crypt

# Make all the files contained in secretdir folder secret
secretdir/** filter=git-crypt diff=git-crypt
```

**After** you created the `.gitattribute` file, you can put the secrets in the place you have just declared. If you put the files before the `.gitattribute`, your secrets won't be encrypted!

Before commit anything, you can have a confirmation that files will be encrypted using `git-crypt status` command

```bash
# Show whether files are encrypted or not
git-crypt status

# Show encrypted files only
git-crypt status -e

# Show unencrypted files only
git-crypt status -u
```

If a file was previously there, it won't be encrypted. You need to run the command `git-crypt status -f`. I repeat myself: if you're using this command, it means the file was already in your repo in cleartext.
So you need to rotate the secrets that are in that files. Otherwise it's very easy for an attacker to see the secrets just looking at previous commits.

Now you can commit and push. You'll see only some encrypted binary files in your public repository! You're able to see them locally.

## Moving the symmetric key to another device

So good so far... But if you clone the repository elsewhere, you will download the encrypted files. So how can we decrypt the files again?
To answer this question we need to reveal some magic. `git-crypt` decrypt files using a symmetric key.

During the initialization with `git-crypt init`, it created the simmetric key and he put it in `<YOUR_REPO_PATH>/.git-crypt/keys/default`.
You can easily export it with this command

```bash
git-crypt export-key /path/to/keyfile
```

with this key you are able to decrypt also on your other devices. So keep it secure.
To decrypt a repository protected with `git-crypt` you can use the command

```bash
git-crypt unlock /path/to/keyfile
```

## Using GPG keys

I know what you're thinking: "Come on... I have 30+ repository, I can't store and move the keys for every repo! There should be an easier way to handle them.". There is, indeed!

You can use your GPG key to unlock your repository. If you don't have one, you can follow the [Github guide to create the GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

All you need to do is to allow your your GPG key to decrypt the repository

```bash
# From now on, you're able to unlock using <YOUR_GPG_KEY>
git-crypt add-gpg-user <YOUR_GPG_KEY_ID>
```

To find your GPG key, you can use the following command. I'm assuming you have already installed [GnuPG](https://gnupg.org/index.html)

```bash
gpg --list-secret-keys --keyid-format=long
```

Then, if you clone your repo elsewhere, you can unlock again with

```bash
git-crypt unlock
```

git-crypt will be smart enough to look into machine for the GPG key. If it finds it, it will decrypt everything!

### How the GPG mode works

... But how does it work? I assume you don't like magic.

When you write

``` bash
git-crypt add-gpg-user <YOUR_GPG_KEY_ID>
```

`git-crypt` will encrypt the symmetric key using your public GPG key, and it will commit into your repo in `.git-crypt/keys/default/0` folder.

Then, when you write

```bash
git-crypt unlock
```

`git-crypt` will find your GPG key in your Mac, it will decrypt the symmetric key that it saved in `.git-crypt/keys/default/0` using your private GPG key. Finally, it will decrypt the secrets using the symmetric key just decrypted.



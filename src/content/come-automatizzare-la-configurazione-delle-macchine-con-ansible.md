---
layout: post
title: Come automatizzare la configurazione delle macchine con Ansible · DevOps
description: Impariamo ad automatizzare task noiosi con Ansible.
image: img/productivity/monitors.jpg
author: Mattia Natali
date: 2019-08-14T07:03:47.149Z
tags: 
  - DevOps
  - Dev
  - Ansible
draft: true
---

## Introduzione

Siete al lavoro e avete il compito di configurare 20 macchine virtuali tutte allo stesso modo? Siete a casa e avete il vostro Raspberry Pi che purtroppo ha corrotto l'SD card e quindi dovete riconfigurarlo per l'ennesima volta? Allora Ansible potrebbe risolvere molti dei vostri problemi!

Se siete come me sono certo che non vi piace passare la giornata ad eseguire task ripetitivi che danno praticamente zero valore aggiunto a voi stessi: eseguire task ripetitivi non è un compito che deve essere fatto da noi, possiamo benissimo delegarlo alle macchine per poterci dedicare a cose che veramente contano.

Come facciamo ad automatizzare questi task? Una risposta sicuramente efficace è [Ansible](https://www.ansible.com/), lo strumento di configurazione che preferisco.

## Obiettivo

Se avete avuto di leggere la [documentazione ufficiale di Ansible](https://docs.ansible.com/ansible/latest/user_guide/quickstart.html), sono certo che avrete notato che è tanto noiosa quanto è potente il tool stesso. È facile che vi addormentiate a leggerla ancor prima di capire le reali potenzialità di Ansible.

Ecco che allora ho deciso di scrivere questa mini guida sperando che sia più efficace della documentazione ufficiale. Spero di raggiungere questo obiettivo tramite un esempio concreto che è mi è capitato e che utilizzo tutt'ora: **andremo a configurare un [VPN Server](https://it.wikipedia.org/wiki/Virtual_Private_Network) su un [Raspberry Pi](https://www.raspberrypi.org/)**.

Grazie a questo playbook di Ansible, possiamo creare un VPN Server su un Raspberry Pi lanciando un unico comando `ansible-playbook -vv -i hosts vpn.yml`. **Le funzioni che esegue sotto le quinte sono molte**:

- Scarica il certificato tramite https://letsencrypt.org/ del dominio che sta puntando a casa nostra, per esempio `casamia.mattianatali.it`.
- Imposta il rinnovo automatico del certificato stesso.
- Apre le porte corrette sul Raspberry Pi per far funzionare la VPN.
- Installa tutte le librerie ed applicazioni necessarie per installare il VPN Server.
- Configura correttamente le impostazioni che decidiamo noi per la VPN, per esempio l'utente per accedervi.
- Imposta l'aggiornamento automatico dei certificati in base al rinnovo del certificato di Let's Encrypt.

Immaginate ora se non avessimo avuto Ansible che facesse tutte queste cose con un comando. Sicuramente dopo 2 giorni che ho eseguito manualmente questi comandi mi sarei già dimenticato tutto, senza contare il numero di tentativi che avrei dovuto fare anche la seconda volta per riconfigurare tutto da zero.
Proprio per questo, una volta che ho capito come potevo fare, ho creato lo script Ansible. **Ora ho in una [repository pubblica](https://github.com/matitalatina/vpn-raspberry-ansible/) il playbook versionato e pronto all'uso**.

In questa guida non ci soffermeremo troppo sui dettagli della VPN: **a noi interessano di più i ragionamenti che ci sono stati per arrivare a questo risultato e quali funzionalità di Ansible abbiamo utilizzato**. La creazione della VPN è solo un esempio concreto che copre molte funzionalità di Ansible.

## Requisiti

I requisiti per seguire questa guida sono i seguenti:

- Abbiamo un minimo di conoscenze di linux. I comandi `sudo`, `apt-get install`, `cd`, `chmod`, `ssh` dovrebbero esserci familiari.
- [Abbiamo installato sul vostro portatile Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).
- [Il nostro Raspberry Pi deve avere SSH abilitato](https://www.raspberrypi.org/documentation/remote-access/ssh/).

## Glossario

Il primo scoglio che si incontra con Ansible è imparare e ricordarsi i vari termini che utilizza. Qui un piccolo riassunto che ci aiuterà nel corso della guida:

- *Moduli*: i moduli sono dei piccoli programmi che Ansible ci offre per portare a termine i task. Per esempio: vogliamo installare un pacchetto tipo vim? Possiamo usare il modulo [apt](https://docs.ansible.com/ansible/latest/modules/apt_module.html), vogliamo aggiungere un cronjob? C'è il modulo [cron](https://docs.ansible.com/ansible/latest/modules/cron_module.html). [Ce ne sono davvero un'infinità](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html).
- *Task*: per esempio un task è "installa il programma nginx". Possiamo vederli come l'unità più piccola che abbiamo in Ansible, sostanzialmente è il richiamo di un modulo con i vari parametri. Un esempio di task è il seguente
  ```yml
  - name: Install nginx
    apt: 
      name:
        - nginx
  ```
- *Ruolo*: Ansible spiega il ruolo usando una metafora calcistica. Un esempio di ruolo può essere "attaccante", "difensore", "centrocampista". Calando nel nostro esempio abbiamo due ruoli: "installatore del certificato", "installatore della VPN". Insomma è un insieme di tasks che hanno una funzione ben precisa, un ruolo appunto.
- *Playbook*: è l'unità più grande che abbiamo in Ansible. Un playbook organizza i vari ruoli per portare a termine il nostro compito. Per esempio nel nostro caso è l'insieme dei due ruoli precedentemente spiegati. [La mia repository sulla creazione della VPN](https://github.com/matitalatina/vpn-raspberry-ansible/) è appunto un playbook. Nel nostro caso avremo un playbook che svolgerà il nostro compito, ossia installare la VPN con i vari certificati.
- *Handler*: sono dei task che possono essere avviati solo nei casi che è veramente necessario eseguirli. Un piccolo esempio: se modifichiamo la configurazione di nginx, abbiamo bisogno di riavviare nginx. Quindi un handler può essere il riavvio di nginx che viene eseguito solo se effettivamente andiamo a modificare la configurazione. **Un vantaggio di utilizzare Ansible è che i comandi sono idempotenti**: in altre parole il risultato è sempre il medesimo, sia se il comando deve essere eseguito oppure no. Un esempio è l'installazione dell'applicazione nginx, se non è installato procede con 'installazione, se invece è già installato non lo esegue, ma comunque ci restituisce "ok nginx è installato".
- *Inventory*: È un file che contiene al suo interno dei gruppi che a loro volta contengono delle macchine. Queste macchine sono quelle che verranno influenzate dalla nostro playbook. Ansible è molto potente, con un solo comando potete installare la VPN su 100 macchine. Noi avremo un gruppo chiamato `vpns` che al suo interno avrà definito la nostra macchina target di nome `rpi` (il Raspberry Pi).

Ora abbiamo una terminologia comune, non è necessario capire tutto ora, sicuramente è ancora tutto molto fumoso. Ma più avanti, dopo aver visto un esempio concreto, sarà tutto più chiaro.

## Primo passo: eseguire il task manualmente

Prima di automatizzare dobbiamo aver chiaro cosa dobbiamo fare, la prima volta magari non abbiamo proprio le idee chiare, facciamo molti tentativi e alcuni finiranno in un nula di fatto. **Quindi la prima cosa da fare è provare manualmente** senza scomodare Ansible così da essere più veloci nella fase di "costruzione" dei vari task per raggiungere l'obiettivo. Nel nostro caso ci facciamo prima un po' di cultura sulla VPN, leggiamo come funziona [strongswan](https://www.strongswan.org/), che librerie ha bisogno per funzionare, come configurarlo ecc. Poi ci facciamo una cultura su [Let's Encrypt](https://letsencrypt.org/) per rilasciare un certificato valido per il nostro dominio `casamia.mattianatali.it` che punta a casa nostra, in modo tale da avere il punto di accesso alla nostra VPN.

Tutta questa fase ve la risparmio, la cosa che dobbiamo tenere a mente è questa: **durante la fase manuale teniamo a mente ogni passaggio che svolgiamo per portare a termine il nostro compito**, ogni singolo file di configurazione che abbiamo modificato, qualsiasi cosa dobbiamo tenerne traccia perchè fra poco la automatizzeremo.

## Definiamo i ruoli

Una volta raggiunto l'obiettivo manualmente, è tempo di organizzare le idee. Alla fine della nostra analisi il nostro playbook di Ansible deve eseguire i seguenti task:

- Scarica il certificato tramite https://letsencrypt.org/ del dominio che sta puntando a casa nostra, per esempio `casamia.mattianatali.it`.
- Imposta il rinnovo automatico del certificato stesso.
- Apre le porte corrette sul Raspberry Pi per far funzionare la VPN.
- Installa tutte le librerie ed applicazioni necessarie per installare il VPN Server.
- Configura correttamente le impostazioni che decidiamo noi per la VPN, per esempio l'utente per accedervi.
- Imposta l'aggiornamento automatico dei certificati in base al rinnovo del certificato di Let's Encrypt.

Di tutti questi task **possiamo trovare due ruoli ben distinti** che possono essere separati.

- **La generazione e il mantentimento dei certificati** per `casamia.mattianatali.it` usando Let's Encrypt.
- **Installazione della VPN** che utilizza i certificati precedentemente creati.

Che vantaggi porta separare i task trovati in questi due ruoli?

- Più i ruoli sono autocontenuti e specifici, più sono semplici da mantenere.
- Più sono autocontenuti più è facile riutilizzarli per altri playbook.
- Se il ruolo definito è abbastanza standard, è facile che qualcuno lo abbia già implementato!

Infatti Ansible ha un sito apposta per cercare questi ruoli, si chiama [Ansible Galaxy](https://galaxy.ansible.com/). La generazione dei certificati tramite Let's Encrypt è una cosa abbastanza standard, ed infatti siamo fortunati! Abbiamo un ruolo che fa già quello che ci interessa, [lo possiamo trovare qui](https://galaxy.ansible.com/geerlingguy/certbot), il modo migliore per imparare ad usarlo è comunque guardare [il suo repository su GitHub](https://github.com/geerlingguy/ansible-role-certbot).

Per installare il ruolo, per poterlo utilizzare fra poco, scriviamo in console:

```sh
ansible-galaxy install geerlingguy.certbot
```

Cercando sempre su quel sito non ho trovato un ruolo che crei la VPN, quindi per quello dobbiamo arrangiarci.

## Definiamo il Playbook

Abbiamo detto che i moduli e i task sono la parte atomica di ansible, questi sono raggruppati in ruoli che svolgono una determinata funzione (nel nostro caso sono due), l'entità che orchestra questi ruoli è il playbook.
Se volessimo raffigurarlo in un grafico:

```yml
playbook
  ruoli
    tasks
```

**Per creare la configurazione della nostra VPN adottiamo un approccio [top-down](https://it.wikipedia.org/wiki/Progettazione_top-down_e_bottom-up)**. In altre parole iniziamo a lavorare sulla più "esterna" e generale al problema, per poi entrare sempre più nel dettaglio fino ai vari task. La parte che contiene tutte le altre è il **playbook**.
Il nostro playbook deve far partire in sequenza:

- Il ruolo che genera i certificati. Già implementato grazie alla libreria che abbiamo trovato su [Ansible Galaxy](https://galaxy.ansible.com/)
- Il ruolo che installa la VPN. Dobbiamo implementarlo.

Ansible lavora molto sulle convenzioni, iniziamo fin da subito ad utilizzare le [best practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html) fornite da Ansible.

Possiamo prendere come riferimento la mia repository con il playbook finalizzato. La struttura per creare il nostro playbook è il seguente:

```yml
group_vars/
  vpns.yml           # Qui vanno tutte le variabili a livello di gruppo (il nostro gruppo si chiama vpns)
   
host_vars/
   rpi.yml           # Qui assegnamo le variabili per le singole macchine (l'unica nostra macchina si chiama rpi)

vpn.yml              # Questo è il nostro playbook
hosts                # È il nostro inventory, definiamo i gruppi (vpns) e le macchine (rpi) su cui vogliamo eseguire il playbook.

roles/               # Questa cartella contiene tutti i ruoli che andremo a definire
    vpn-install/     # Questa cartella contiene il nostro ruolo per installare la VPN.
      ...            # La struttura delle sottocartelle la vedremo più avanti.
```

Iniziamo a scrivere il nostro playbook nel file `vpn.yml`

```yml
---
- name: Deploy IKEv2 Road Warrior VPN
  hosts: vpns

  roles:
    - role: geerlingguy.certbot
      become: yes
    - role: vpn-install
      become: yes
```

Il formato con cui viene scritto il file è YAML, è un formato molto leggibile ed è ormai uno standard de facto negli applicativi che strizzano l'occhio ai DevOps. [Se non lo avete mai visto vi consiglio di leggere questa guida, che spiega velocemente il formato](https://learnxinyminutes.com/docs/yaml/).

Il nostro Playbook dovrà fare solo una cosa: creare un VPN Server. Nel gerco di Ansible, un playbook è formato da più **plays**. Noi abbiamo un solo *play* nel nostro playbook.

Come si fa a capire come e quando creare un play? Solitamente se abbiamo *più ruoli* che influenzano *un unico gruppo* di macchine, allora questo è un buon candidato per essere un play. Se invece avessimo avuto dei ruoli che avevano come target il raspberry ed altri ruoli che dovevano configurare dei routers, allora il nostro playbook sarebbe composto da due plays. Perchè un play andava a lavorare sui Raspberry Pi, l'altro sui routers.

Spieghiamo i vari comandi che ci sono dentro ad un play:

- `name`: possiamo inserire una breve descrizione di cosa farà il nostro play.
- `hosts`: definiamo quale gruppo verrà utilizzato come target del nostro play. Nel nostro caso è il gruppo `vpn`, che al suo interno avrà il nostro Raspberry Pi.
- `roles`: definiamo i ruoli in ordine cronologico che verranno avviati sui nostri hosts.
- `role: geerlingguy.certbot`: il primo ruolo che verrà avviato sarà quello che abbiamo trovato in [Ansible Galaxy](https://galaxy.ansible.com/), esso installerà e manterrà aggiornati i certificati per la VPN.
- `become: yes`: significa che verrà avviato lo script abilitando il *priviledge escalation*. In pratica avvieremo il ruolo come root. Sia il ruolo per scaricare i certificati, sia l'installazione della VPN ha bisogno di essere avviato come root. Quindi in entrambi metteremo `become: yes`.
- `role: vpn-install`: avviamo l'installazione della VPN dopo il ruolo dei certificati. Questo ruolo dobbiamo ancora capire come definirlo.

Il playbook lo abbiamo ultimato. In pratica il nostro playbook sta dicendo questa cosa: "Installa i certificati e poi installa la VPN sulle macchine che fanno parte del gruppo `vpns`".

## Definiamo l'inventario

Abbiamo detto che il playbook lavorerà sul gruppo di macchine denominato `vpns`. Ma dove è definito questo gruppo? Qui entra in gioco **l'inventario**. L'oggetto inventario è dove definiamo i gruppi di macchine e le macchine che compongono questo gruppo.
Il file che contiene questo inventario è il file `hosts`. Il nome è arbitrario, qualsiasi nome gli diamo poi dovrà essere richiamato quando invocheremo il comando per far partire il playbook.

Il nostro file hosts avrà questo contenuto.

```ini
[vpns]
rpi
```

Semplicemente con queste due righe stiamo dicendo che il gruppo `vpns` contiene la macchina `rpi` che è il nome che stiamo dando al nostro Raspberry Pi. È facile intuire che se avessimo avuto più Raspberry Pi, potevamo configurarli contemporaneamente definendoli in questo file nel gruppo `vpns`.

La sintassi dell'inventario è semplice ed è questa

```ini
[gruppo1]
macchina1
macchina2

[gruppo2]
macchina3
macchina4

...
```

## Definiamo le variabili di gruppo e di host

Abbiamo definito il playbook che lavora sul gruppo `vpns`, abbiamo dichiarato il gruppo `vpns` dicendo che al suo interno ha il nostro Raspberry Pi con il nome `rpi` tramite l'inventario. Ma Ansible come fa a sapere come connettersi al nostro Raspberry? Come gli forniamo l'IP, utente, password per connettersi con SSH? Come gli diciamo su quale dominio vogliamo ottenere i certificati? Per ora sa solo che c'è una macchina chiamata `rpi`.

Tutte queste cose sono delle **variabili**, variano in base alla macchina o al gruppo di macchine su cui vogliamo agire. Ansible ha due cartelle adibite a questo scopo, una cartella chiamata `group_vars` conterrà le variabili che sono comuni a tutte le macchine che appartengono ad un gruppo, la cartella `host_vars` conterrà tutte le variabili che sono proprie ad una singola macchina.

Nel nostro progetto possiamo inserire queste due cartelle, queste cartelle avranno dei file YAML che avranno il nome del nostro gruppo in `group_vars` e il nome `rpi.yml` in `host_vars`.

Quindi la struttura delle nostre cartelle, per quanto riguarda le variabili è il seguente:

```yml
group_vars/
  vpns.yml           # Contiene tutte le variabili comuni a tutte le macchine che appartengono al gruppo vpns
   
host_vars/
   rpi.yml           # Contiene tutte le variabili che appartengono alla macchina rpi
```

All'interno del file `rpi.yml` definito nella cartella `host_vars` Ansible potrà trovare tutte le informazioni di cui necessita per portare a termine il playbook. Il file `rpi.yml` contiene le seguenti variabili:

```yml
---
ansible_host: YOUR-SSH-HOST
ansible_user: pi
ansible_password: YOUR-SSH-PASSWORD
domain: casamia.mattianatali.it
# You can add more than one Road Warrior Client.
vpn_users:
  - username: CLIENT-WARRIOR-USERNAME
    password: CLIENT-WARRIOR-PASSWORD
# Change it if you want to restrict the local hosts the Road Warrior Client should see.
vpn_local_ts: "0.0.0.0/0"

# ansible-role-certbot variables
# More info here https://github.com/geerlingguy/ansible-role-certbot
certbot_auto_renew: true
certbot_create_if_missing: true
certbot_create_method: standalone
certbot_auto_renew_user: root
certbot_auto_renew_hour: 3
certbot_auto_renew_minute: 30
certbot_auto_renew_options: "--quiet --no-self-upgrade"
certbot_create_standalone_stop_services: []
certbot_certs:
  - email: YOUR-EMAIL-HERE
    domains:
      - "{{domain}}"
```

Tramite le variabili `ansible_host`, `ansible_user`, `ansible_password` possiamo fornire ad Ansible tutte le informazioni per connettersi ad SSH, per eseguire il nostro playbook.

I campi successivi sono quelli che utilizzeremo quando andremo a creare il ruolo per installare la VPN. Il campo `domain` conterrà il nome del nostro dominio che punta a casa nostra, nel nostro caso è `casamia.mattianatali.it`. In `vpn_users` definiamo l'username e password dei clienti che possono connettersi al nostro VPN. `vpn_local_ts` è una variabile che ci permette di limitare l'accesso ai clienti che si connettono alla VPN, per esempio a casa mia ho limitato alla mia sottorete `192.168.1.0/24`.

Tutte le variabili che iniziano con `certbot_` fanno parte del ruolo che abbiamo scaricato con Ansible Galaxy, ci permettono di configurare qualsiasi cosa riguardo l'aggiornamento dei certificati per il dominio `casamia.mattianatali.it`. Trovare le variabili che compongono il ruolo che abbiamo scaricato è semplice, [basta leggere la documentazione del ruolo che abbiamo utilizzato](https://github.com/geerlingguy/ansible-role-certbot).

Possiamo notare che l'ultima riga del nostro file ha una variabile particolare `{{domain}}`. **Le doppie graffe ci permettono di richiamare un'altra variabile già definita**. In questo modo possiamo definire solo la variabile `domain` nella quarta riga, che automaticamente la variabile `{{domain}}` avrà lo stesso valore. Così facendo abbiamo un solo ["una singola sorgente di verità"](https://en.wikipedia.org/wiki/Single_source_of_truth), la variabile `domain`, ed evitiamo errori grossolani tipo aggiornare solo una variabile e non l'altra.

Per inserire i valori nelle doppie graffe, Ansible utilizza un template engine molto famoso in Python: [Jinja2](https://docs.ansible.com/ansible/latest/user_guide/playbooks_templating.html). Jinja2 è molto potente, per ora ci basta sapere che quando scriviamo `{{valore}}` significa che stiamo inserendo il contenuto della variabile che troviamo nelle parentesi.

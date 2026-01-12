# Rick & Morty Character Management System

În acest proiect am dezvoltat o aplicație web completă (Full Stack) pentru gestionarea și vizualizarea unei baze de date cu personaje din universul "Rick and Morty". Am urmărit crearea unui sistem care să permită atât accesul public pentru vizitatori, cât și o zonă administrativă securizată pentru gestionarea conținutului.

---

## 1. Descrierea generală a proiectului

Scopul nostru a fost să construim o aplicație funcțională care să îmbine un Frontend modern cu un Backend robust, capabil să gestioneze tipuri de date flexibile (JSON) într-o bază de date relațională.

**Funcționalitățile pe care le-am implementat:**

### Partea Publică (Guest)
* **Afișare Grid:** Am creat o interfață vizuală bazată pe carduri pentru afișarea personajelor.
* **Paginare Avansată:** Am implementat un sistem de navigare care permite utilizatorului să sară direct la o pagină și să aleagă câte elemente vrea să vadă (5, 10, 20 sau 50).
* **Căutare Inteligentă:** Am dezvoltat o funcție de căutare "case-insensitive" care verifică simultan numele și specia personajului în baza de date.
* **Filtrare Dinamică:**
    * Am adăugat butoane pentru filtrarea după **Status** (Alive, Dead, Unknown).
    * Am creat un meniu dropdown pentru **Specie**, care se populează automat cu valorile existente în baza de date.
* **Sortare:** Am oferit utilizatorilor posibilitatea de a sorta lista după Nume sau Status (Ascendent/Descendent).

### Panou de Administrare (Securizat)
* **Autentificare:** Am securizat accesul folosind JSON Web Tokens (JWT) și am criptat parolele cu Bcrypt.
* **CRUD Complet:**
    * **Adăugare:** Administratorii pot introduce personaje noi.
    * **Vizualizare:** Am creat un tabel administrativ cu funcție de căutare globală.
    * **Editare:** Datele pot fi modificate în timp real.
    * **Ștergere:** Posibilitatea de a elimina înregistrări.
* **Upload Imagini:** Am implementat un convertor care transformă imaginile în format Base64 pentru a le stoca direct în baza de date.

---

## 2. Tehnologiile utilizate

Am ales arhitectura Client-Server pentru a separa logica aplicației.

### Frontend (Client)
* **React.js (v18):** L-am folosit pentru construirea interfeței reactive.
* **React Router Dom (v6):** L-am utilizat pentru navigarea între pagini (`/`, `/admin`, `/details/:id`).
* **Axios:** Folosit pentru cererile HTTP către server.
* **CSS3:** Am stilizat aplicația folosind Flexbox și Grid pentru a fi responsive.

### Backend (Server)
* **Node.js & Express.js:** Tehnologiile pe care am construit API-ul REST.
* **MySQL2:** Driverul folosit pentru interacțiunea cu baza de date.
* **JWT & Bcrypt:** Soluțiile noastre pentru securitate.
* **Body-Parser:** L-am configurat special (`50mb`) pentru a permite upload-ul de imagini mari.

### Baza de Date
* **MySQL:** Am optat pentru o abordare hibridă, folosind coloane de tip `JSON` pentru a stoca atributele variabile ale personajelor.

---

## 3. Structura datelor

Am structurat baza de date `rick_and_morty` în două tabele principale:

### A. Tabelul `data` (Personaje)
Aici stocăm informațiile despre personaje. Am ales tipul `JSON` pentru flexibilitate.

| Câmp | Tip de date | Descriere |
| :--- | :--- | :--- |
| **id** | `INT (PK, AI)` | Identificator unic. |
| **data** | `JSON` | Obiectul care conține toate detaliile (nume, status, imagine, etc). |

**Exemplu de obiect JSON stocat de noi:**
```json
{
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "origin": { "name": "Earth" },
  "location": { "name": "Citadel of Ricks" }
}
```

### B. Tabelul users (Administratori)
Acest tabel gestionează accesul în panoul de control și securitatea aplicației.
* id	INT (PK, AI)	Identificator unic al administratorului.
* username	VARCHAR(255)	Numele de utilizator (trebuie să fie unic).
* password	VARCHAR(255)	Parola utilizatorului (stocată criptat sub formă de hash).

Am adaugat si doua aplicatii JavaScript(una de adaugare și una de ștergere administratori) tot pe partea de Backend dar nu rulează în fundal și sunt destinate doar modificării bazei de date de către host.

## 4. Utilizarea inteligenței artificiale

În cadrul acestui proiect, am integrat Inteligența Artificială folosind-o pentru a eficientiza dezvoltarea.

### A. Cum ne-a ajutat AI-ul:

* **Accelerarea dezvoltării:** Am folosit AI pentru a genera structura inițială a serverului și a componentelor React, ceea ce ne-a permis să ne concentrăm pe logica complexă.
* **Soluții SQL complexe:** Deoarece am lucrat cu date JSON în MySQL, am apelat la AI pentru a construi interogările corecte (ex: LOWER(data->>"$.name")), asigurând o căutare rapidă și precisă.
* **Debugging:** Când am întâmpinat erori obscure (precum conflicte de module Git sau probleme de CORS), am folosit AI pentru a diagnostica cauza și a implementa soluțiile optime.
* **Securitate:** Am implementat recomandările AI privind securizarea rutelor cu middleware și hash-uirea parolelor, renunțând la stocarea lor în format text.

## 4. Concluzii

Pentru noi, acest proiect a reprezentat o provocare tehnică interesantă și o oportunitate de a aprofunda dezvoltarea unei aplicații web.

### Dificultăți

* **Limitări la upload:** Inițial, serverul bloca imaginile mari. Am rezolvat problema reconfigurând limita de payload în Express la 50MB.
* **Paginarea:** Sincronizarea numărului total de pagini între server și client a fost dificilă. Am soluționat acest lucru modificând API-ul să returneze atât lista de date, cât și numărul total de înregistrări (count).
* **Git Nested Repos:** Am avut probleme cu versionarea din cauza unui repo Git creat automat în folderul clientului. Am corectat structura ștergând fișierele .git interne.
#### **Ce am învățat:** Am învățat cum să utilizăm date JSON într-o bază relațională, cum să securizăm o aplicație React și cum să gestionăm starea globală a aplicației pentru filtre și căutări. Soluția finală este una perfect funcționabilă.

## Bibliografie


1.  **Rick and Morty Fandom** - Pentru datele despre personaje și universul serialului.
    * *https://rickandmorty.fandom.com/*
2.  **Stack Overflow** - Pentru rezolvarea erorilor specifice de SQL și React întâmpinate pe parcurs.
    * *https://stackoverflow.com/*
3.  **React Documentation** - Documentația oficială pentru utilizarea corectă a hook-urilor (`useState`, `useEffect`).
    * *https://react.dev/*
4.  **MySQL JSON Reference** - Pentru documentarea funcțiilor specifice de manipulare a datelor JSON în SQL.
    * *https://dev.mysql.com/doc/refman/8.0/en/json-function-reference.html*
5.  **Express.js Docs** - Pentru configurarea serverului și a middleware-urilor.
    * *https://expressjs.com/*



---
title: Animal Shelter
description: A web app that digitises registration, adoption requests and management at animal shelters.
role: Individual
---

## Problem

At a shelter, the animals' records live in one place and the requests from people who want to adopt live in another. It gets hard to tell which animal has been adopted and which request is still waiting.

The Animal Shelter Management System (called **Pet 4 Life** inside the app) splits the work between two roles:

- **User:** Signs up and logs in, sees the shelter's animals on cards, can click a photo to enlarge it, and sends a request with **Sahiplen** ("Adopt").
- **Admin:** Adds, edits and deletes animals. Picks the photo from a phone or a computer. Approves or rejects incoming requests.
- **Statistics:** Total animals, adopted, still at the shelter and pending requests. Clicking a box filters the animal list accordingly.

An adopted animal's card shows an **Adopted** badge. The same user can't send a second request for the same animal, and no request can be sent for an animal that has already been adopted. The interface works on every screen size, from phone to desktop.

## Architecture

```
Browser (HTML, CSS, JavaScript)
      │  fetch /api/...
      ▼
Vercel
  ├─ public/   static front end
  └─ api/      Express app (a single function)
        │
        ▼
MongoDB (Mongoose)
```

- **Front end:** No framework. Each page has its own HTML and script (`index`, `giris`, `uyeol`, `kullanici`, `yonetici`). The shared parts live in `components.js`: `<site-header>` and `<site-footer>` are Web Components, while the animal card, modal and button are small helper functions.
- **Backend (Express + Mongoose):** Three models: `Kullanici` (user), `Animal` and `Istek` (request). The endpoints cover login, sign-up, adding/listing/updating/deleting animals, sending/listing/deleting requests, marking an animal as adopted, and statistics.
- **Deployment:** On Vercel the front end is served as static files and the API runs as a single function. `vercel.json` routes `/api/*` requests to that function. The front end picks the API address by environment: `http://localhost:3001/api` locally, and `/api` on the same domain in production.

## Where I struggled

- **The database connection dropping on Vercel.** Running Express locally as an always-on server is easy. On Vercel the app wakes up as a function, and the connection can drop on a cold start or while idle. I wrote a middleware that checks the connection state (`readyState`) before every request. If there is no connection it opens one, and if it can't within 8 seconds the request returns a 503 instead of hanging, and the next request tries again.
- **Where to put the photo.** Instead of setting up a file upload service, I shrink the chosen photo in the browser (longest side 800 pixels, JPEG) and store it as a data URL on the animal's record. Files over 20 MB are rejected. Transparent PNGs would turn black as JPEGs, so I paint the background white. Express's default 100 KB JSON limit wasn't enough, so I raised it to 10 MB. This is fine for a small demo; with many more animals the images should move to separate storage.
- **New requests without refreshing the page.** The admin panel checks for requests every 10 seconds and when you return to the tab, and it doesn't poll while the tab is in the background. If the list hasn't changed, it doesn't redraw. To tell, I build a signature from the request ids and compare it with the previous one, so the panel doesn't flicker for nothing.
- **Writing shared parts without a framework.** I wanted the header, footer, modal and card in one place. Because I add text with `textContent`, an animal name a user types is never interpreted as HTML.
- **Security limits.** As the README says, this is a demo. Passwords are stored in plain text, the admin endpoints aren't authorised on the server, and the role can be chosen at sign-up. That's why the README says not to enter real personal data. The next steps are hashing the passwords, keeping the session in a token or cookie, and moving the role check to the server.

## What I learned

- I learned to build a REST API and Mongoose models from scratch with Express.
- I learned to deploy an Express app on Vercel, with a static front end and the API as a single function.
- I tried writing shared interface parts with Web Components, without a framework.
- I saw that authentication and authorisation aren't features you add later but a layer you have to design from the start.

# BananaShopPro

Minimaler Online-Shop fuer die KIWEBE-Bausteinpruefung.

## Ziel

BananaShopPro ist ein reduzierter Online-Shop fuer vier Bananenprodukte. Die App nutzt Supabase fuer Datenbank und Login, GitHub fuer den Code und Vercel oder Netlify fuer das Hosting.

## Funktionen

- Produktkatalog aus Supabase
- Produktdetailansicht
- Suche und Kategoriefilter
- Warenkorb mit Menge aendern, entfernen und Gesamtsumme
- Login, Registrierung und Logout mit Supabase Auth
- Kaufabschluss als angemeldeter Nutzer ueber die Supabase-Funktion `create_order`
- Kaufhistorie: Kunden sehen eigene Bestellungen, Admin sieht alle Bestellungen
- Adminbereich fuer Produktverwaltung und Bestellungen
- Mobile-first Layout in Schwarz und Weiss

## Lokales Setup

```bash
npm install
cp .env.example .env
npm run dev
```

In `.env` muessen diese Werte gesetzt werden:

```env
VITE_SUPABASE_URL=https://jktaknkhyequdlcuihji.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-public-key
```

Der `service_role` Key gehoert niemals in das Frontend oder in GitHub.

## Deployment

Bei Vercel oder Netlify diese Environment Variables setzen:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Build Command:

```bash
npm run build
```

Publish Directory:

```text
dist
```

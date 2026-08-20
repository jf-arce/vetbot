# Evolution API — infra local de WhatsApp (Dev 1)

Evolution corre en Docker local; n8n (Cloud) llega a él a través de un túnel
`cloudflared`. Ver el porqué de esta decisión en
[`../docs/dev1-plan.md`](../docs/dev1-plan.md) (Fase 0).

## Arranque desde cero

```bash
cd evolution
cp .env.example .env
# completar AUTHENTICATION_API_KEY con: openssl rand -hex 16

docker compose up -d
docker compose logs -f evolution-api   # esperar "Server running"
```

Sacar la URL pública del túnel:

```bash
docker compose logs cloudflared | grep trycloudflare.com
```

Completar `SERVER_URL` en `.env` con esa URL y reiniciar el servicio para que
la tome:

```bash
docker compose up -d evolution-api
```

Verificar:

```bash
source .env
curl -H "apikey: $AUTHENTICATION_API_KEY" https://<url-del-tunel>/instance/fetchInstances
```

Crear la instancia:

```bash
curl -X POST https://<url-del-tunel>/instance/create \
  -H "apikey: $AUTHENTICATION_API_KEY" -H "Content-Type: application/json" \
  -d '{"instanceName":"vetbot","integration":"WHATSAPP-BAILEYS","qrcode":true}'
```

El webhook hacia n8n se setea recién cuando el wf 01 (router) ya está
publicado y se tiene su URL de producción:

```bash
curl -X POST https://<url-del-tunel>/webhook/set/vetbot \
  -H "apikey: $AUTHENTICATION_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "url": "<url-de-produccion-del-wf-01>",
      "webhookByEvents": false,
      "events": ["MESSAGES_UPSERT"]
    }
  }'
```

## Cuando se cae el túnel

La URL de un quick tunnel (`*.trycloudflare.com`) **cambia en cada restart**
de `cloudflared`. Cuando eso pasa hay que rehacer, en este orden:

1. `SERVER_URL` en `evolution/.env` → `docker compose up -d evolution-api`.
2. La URL base de la credencial HTTP de Evolution en n8n.
3. `POST /webhook/set/vetbot` (comando de arriba) con la nueva URL del túnel.

Para que este problema desaparezca hace falta un dominio propio y pasar a un
*named tunnel* de Cloudflare — no está hecho, queda para cuando haga falta
estabilidad de largo plazo (ej. la demo).

## El QR queda pendiente hasta tener un número

Sin escanear el QR, `GET /instance/connect/vetbot` no se completa, pero eso
**no bloquea nada**: todo el desarrollo y pruebas de los workflows se hace con
payloads `MESSAGES_UPSERT` simulados. Cuando aparezca el número:

```bash
curl -H "apikey: $AUTHENTICATION_API_KEY" https://<url-del-tunel>/instance/connect/vetbot
```

Escanear el QR devuelto, y el mismo flujo pasa a ser real sin tocar un solo
nodo de los workflows.

## Seguridad

El túnel expone Evolution a internet. Lo único que lo protege es
`AUTHENTICATION_API_KEY`: generarla al azar (`openssl rand -hex 16`) y nunca
commitear el `.env` (el `.gitignore` de esta carpeta ya lo excluye).

Evolution usa Baileys (API no oficial de WhatsApp): hay riesgo real de ban.
Usar siempre un número secundario, nunca el personal.

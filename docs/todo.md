# To-do — Dev 1 (VetBot)

Estado al 20/08/2026. Ver contexto completo en
[`dev1-estado.md`](dev1-estado.md) y [`dev1-plan.md`](dev1-plan.md).

## Pendiente

- [ ] **Conseguir el teléfono del veterinario** y cargarlo en Supabase
      (`configuracion_general`, clave `telefono_veterinario`, hoy tiene el
      placeholder `<a completar>`). Sin esto el wf 08 (alerta urgente) no
      tiene a quién notificar.
- [x] **Probar el nodo de Gemini de la clasificación de intención (wf01)**
      con la API key real — funcionó: clasificó bien "mi perro esta
      vomitando desde ayer" → `sintoma`. Los otros dos nodos de IA (triaje en
      wf02, redacción de historial en wf03) quedan sin probar por ahora
      porque requieren publicar esos workflows para que wf01 los invoque (ver
      ítem de "publicar" más abajo) — se pueden probar sueltos abriendo cada
      uno en el editor de n8n sin publicar nada.
- [ ] **wf04 (ofrecer turno) y wf05 (confirmación de turno) — bloqueados.**
      Dev 2 los pasó como JSON pero están en otra instancia de n8n, con un
      patrón distinto (webhook propio en vez de Execute Workflow Trigger),
      el nodo final de respuesta por WhatsApp sin conectar, y usan dos
      credenciales que no existen en nuestra instancia (Supabase API REST y
      Google Calendar OAuth2 de `zentexlabs@gmail.com`) — ninguna se puede
      crear por script, Google Calendar en particular necesita que el dueño
      de esa cuenta haga el login OAuth a mano en
      `josefranciscoarce.app.n8n.cloud`. Detalle completo en
      `contrato-dev1-dev2.md` (sección 3.1). Hasta que eso se resuelva, el
      router sigue respondiendo con un mensaje genérico en esos casos.
- [ ] **Escanear el QR de WhatsApp**: `GET /instance/connect/vetbot` contra
      el túnel de Evolution, para que el envío real de mensajes funcione
      (hoy tira `Timed Out`, es lo esperado sin sesión).
- [ ] **Publicar los workflows** en n8n (`active: true`) — **a propósito no
      se hizo todavía**, se sigue en modo test/manual mientras se prueba.
      Importante: el nodo "Execute Workflow" exige que el sub-workflow
      llamado esté publicado para poder invocarlo (confirmado con un test
      real: wf01→wf02 falló con `Workflow is not active and cannot be
      executed`). wf00, wf02, wf03 y wf08 no tienen webhook público —
      publicarlos no expone nada a internet, solo permite que se llamen
      entre sí. El único que expone un endpoint público al publicarse es
      **wf01** (tiene el Webhook de Evolution). Mientras no se publique
      wf01, se puede seguir probando cada sub-workflow por separado
      abriéndolo en el editor de n8n, pero no se puede probar la cadena
      completa wf01→wf02/wf03/wf00 sin publicar al menos los sub-workflows.
- [ ] **Configurar el webhook en Evolution** (`POST /webhook/set/vetbot`)
      apuntando a la URL de producción del wf 01, evento único
      `MESSAGES_UPSERT` — depende de publicar primero.
- [ ] **Correr la batería de verificación completa** del plan: 5 payloads
      `MESSAGES_UPSERT` simulados (cliente nuevo, síntoma leve, síntoma
      grave, pedido de historial, mensaje ambiguo) y confirmar en Supabase
      después de cada uno. Ya se probó a mano el camino de "cliente nuevo"
      hasta el paso de alta — falta el resto.
- [ ] **Coordinar con Dev 2** el reemplazo de las 3 ramas placeholder del
      router (`esperando_confirmacion_turno`, `esperando_eleccion_horario`,
      `esperando_respuesta_seguimiento`) por los wf 04/05/06 reales, cuando
      Dev 2 los tenga listos. Hoy responden con un mensaje genérico (ver
      sticky note en el canvas del wf 01).

## Hecho

- [x] Evolution API + túnel cloudflared arriba (Docker Compose, 4 servicios).
- [x] Instancia `vetbot` creada en Evolution (falta el QR, ver arriba).
- [x] Migración de Supabase aplicada y verificada (`dev1_ajustes_router*`).
- [x] 5 workflows construidos y validados en n8n (00, 01, 02, 03, 08).
- [x] Exportados a `workflows/*.json` + `workflows.md`.
- [x] Credenciales de n8n cargadas y probadas: Postgres (real), Evolution
      (real), Gemini (cargada, sin probar con key real todavía).
- [x] Bug de SSL de Postgres resuelto (`Ignore SSL Issues` en la credencial).
- [x] Bug del índice parcial en `ON CONFLICT (wa_message_id)` resuelto.
- [x] Cadena completa probada de punta a punta hasta el envío por WhatsApp
      (que falla como se esperaba, sin QR escaneado).

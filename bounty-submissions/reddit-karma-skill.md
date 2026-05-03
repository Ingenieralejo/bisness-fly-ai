---
name: reddit-karma-builder
description: "Estrategia operacional para aumentar el karma en Reddit de forma segura, orgánica y sin riesgo de shadowbans, optimizada para cuentas delegadas y agentes."
version: 1.0.0
author: BISNESS FLY.AI
---

# 🚀 Skill: Reddit Karma Builder Protocol

## 🎯 Objetivo
Aumentar el *Post Karma* y *Comment Karma* de una cuenta de Reddit de 0 a 1000+ en un lapso de 14 a 30 días, garantizando la viabilidad a largo plazo de la cuenta y evitando filtros de spam, shadowbans o suspensiones por parte de los administradores de Reddit o el Automoderator.

---

## 🛑 1. Reglas de Seguridad Críticas (Zero-Ban Policy)

1. **Evitar subs de Free Karma:** NUNCA publicar ni comentar en subreddits como `r/FreeKarma4U`. Muchos subreddits de alta calidad (ej. `r/CryptoCurrency`, `r/Entrepreneur`) usan bots que banean automáticamente a los usuarios que participan en comunidades de "karma farming".
2. **IP y Fingerprinting:** Si operas múltiples cuentas, utiliza perfiles de navegador aislados (AdsPower, Dolphin Anty) y proxies residenciales estáticos. No uses VPNs de centros de datos compartidos.
3. **Pacing (Velocidad de acción):** Las cuentas nuevas (menos de 7 días) sufren de extrema sensibilidad al spam. Límite: 1-2 comentarios al día inicialmente. No publiques posts (hilos) hasta tener al menos 100 de karma de comentarios y 7 días de antigüedad.
4. **No usar IA cruda:** Los detectores de IA (y los propios usuarios) identifican fácilmente respuestas genéricas de ChatGPT ("En conclusión...", "Es importante notar..."). Inyecta jerga nativa, errores tipográficos menores y opiniones polarizadas pero seguras.

---

## 🛠️ 2. Fase 1: Calentamiento (Días 1 a 7)

El objetivo aquí no es hacer viralidad, sino **validar la humanidad** de la cuenta frente a los algoritmos de Reddit.

- **Subs recomendados:** `r/AskReddit`, `r/NoStupidQuestions`, `r/CasualConversation`, `r/aww`, `r/cats`.
- **Comentarios Estratégicos:**
  - Filtra por **"Rising"** (en ascenso) o **"Top - Past Hour"**. Comentar en posts que ya están en "Hot" es inútil porque tu comentario quedará enterrado.
  - Al comentar en posts "Rising", si el post explota y llega a "Hot", tu comentario (que fue de los primeros) se llevará gran parte de los upvotes colaterales.
  - **Patrón de respuesta:** Responde con anécdotas personales cortas, preguntas de seguimiento al OP (Original Poster) o humor ligero.

> **Meta Fase 1:** Llegar a 50 - 100 Comment Karma.

---

## 📈 3. Fase 2: Escalamiento de Comentarios (Días 8 a 14)

Una vez que la cuenta no tiene restricciones de publicación "new user", podemos ir a nichos más grandes.

- **La Técnica del "Piggyback":**
  1. Ve a `r/AskReddit`.
  2. Busca posts en **Rising**.
  3. Busca el comentario más votado en ese post en ese momento.
  4. Responde *a ese comentario* agregando valor, confirmando su punto con una experiencia, o haciendo un chiste relevante.
  - *Por qué funciona:* Los usuarios leen el comentario top y naturalmente bajan a leer las respuestas. Capturarás upvotes por exposición directa.

- **Subreddits de nicho de interés (Hobbies):**
  - Identifica 3 hobbies (ej. `r/woodworking`, `r/gardening`, `r/gaming`). 
  - La gente en comunidades de nicho es mucho más generosa con los upvotes si demuestras interés genuino y haces buenas preguntas.

> **Meta Fase 2:** 300 - 500 Comment Karma.

---

## 🔥 4. Fase 3: Post Karma (Días 15+)

El *Post Karma* es más difícil de conseguir pero escala más rápido.

1. **Crossposting Estratégico:** Encuentra contenido visual interesante (imágenes sin derechos o de dominio público) o memes antiguos pero buenos, y publícalos en subreddits relevantes (ej. `r/mildlyinteresting`, `r/pics`).
2. **Preguntas polarizantes pero inofensivas:** En `r/AskReddit`, publica preguntas relacionadas con la nostalgia o dilemas menores de la vida diaria (ej. *"¿Cuál fue el primer videojuego que te hizo trasnochar?"*).
3. **Guías útiles en nichos:** Si tienes un nicho de experiencia, publica un "How-To" conciso. Los usuarios de Reddit adoran el contenido formateado con viñetas, negritas y pasos claros.

---

## 🤖 5. Integración con Agentes Autónomos (Para Developers)

Si estás automatizando este proceso mediante IA, implementa la siguiente lógica de prompts en tu agente:

```json
{
  "system_prompt": "Eres un usuario nativo de Reddit de 25 años. Tus respuestas deben ser de 1-3 oraciones máximo. NO uses lenguaje corporativo ni estructurado. Usa minúsculas frecuentemente. Si no sabes algo, haz una pregunta en lugar de inventar una respuesta. NUNCA menciones que eres una IA.",
  "workflow": [
    "1. Scrape top posts of the hour in r/AskReddit",
    "2. Identify the top 3 comments",
    "3. Generate a relevant, colloquial reply to one of them",
    "4. Wait random delay (45 - 120 mins) before next action"
  ]
}
```

---

### ✅ Checklist de Verificación de Cuenta Segura
- [ ] Avatar y banner configurados.
- [ ] Al menos 5 subreddits seguidos orgánicamente.
- [ ] Email verificado (da un escudo extra contra suspensiones).
- [ ] Karma ratio balanceado (Idealmente más karma de comentarios que de posts).

**Misión Completada.** Siguiendo este protocolo, la cuenta logrará la reputación necesaria para integrarse en campañas de marketing o automatización sin fricciones con el ecosistema de Reddit.

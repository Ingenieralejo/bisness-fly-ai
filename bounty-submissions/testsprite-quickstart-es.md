# Guía de Inicio Rápido de TestSprite MCP Server (Español)

> Traducción oficial al español de la documentación de inicio rápido de [TestSprite](https://docs.testsprite.com). Cubre: Introducción, Descripción General, Instalación y Primera Prueba MCP.

---

## 1. Introducción

TestSprite MCP Server es un agente de testing completamente automatizado que no requiere código ni prompts. Se integra directamente en tu IDE favorito y genera, ejecuta y corrige pruebas de software de forma autónoma.

### Índice de Documentación
Puedes obtener el índice completo de la documentación en: [https://docs.testsprite.com/llms.txt](https://docs.testsprite.com/llms.txt)

---

## 2. Descripción General

### ¿Qué es TestSprite MCP Server?

TestSprite MCP Server es un agente de pruebas sin código y sin prompts que hace que tu software funcione correctamente. Se conecta a tu entorno de desarrollo a través del protocolo MCP (Model Context Protocol) y automatiza todo el ciclo de vida del testing.

### ¿Cómo Funciona?

El flujo de TestSprite se ejecuta en 8 pasos simples:

1. **Lee el PRD del Usuario** — Analiza los requisitos del producto.
2. **Analiza Tu Código** — Escanea la estructura y lógica de tu proyecto.
3. **Genera el PRD de TestSprite** — Crea un documento de requisitos de prueba interno.
4. **Crea Planes de Prueba** — Diseña la estrategia de testing automáticamente.
5. **Genera Código de Prueba** — Escribe las pruebas unitarias, de integración y E2E.
6. **Ejecuta las Pruebas** — Corre todo el suite de tests contra tu aplicación.
7. **Proporciona Resultados** — Muestra un dashboard con métricas de cobertura y fallos.
8. **Habilita Correcciones** — Sugiere y aplica parches automáticos con IA.

### Beneficios Clave

- **Para Desarrolladores:** Envía código más rápido sin escribir pruebas manualmente, obtén retroalimentación en minutos (no en horas), y corrige problemas automáticamente con análisis impulsado por IA, todo sin salir de tu IDE.
- **Para Equipos:** Logra calidad predecible y lanzamientos más rápidos con cobertura amplia y consistente — incluyendo casos extremos — mientras reduces el esfuerzo manual de QA y el mantenimiento de pruebas.

### Capacidades de Testing

**Frontend (E2E basado en flujos de negocio):**
- Navegación de flujos de usuario
- Flujos de formularios y validación
- Estados visuales y diseños
- Componentes interactivos y UI con estado
- Autorización y flujos de autenticación
- Manejo de errores (UI)

**Backend (API e Integración):**
- Flujos funcionales de API
- Validación de contratos y esquemas
- Manejo de errores y resiliencia
- Autorización y autenticación
- Casos límite y extremos
- Integridad y persistencia de datos
- Pruebas de seguridad

### Resultados Reales

- **90%+ Calidad de Código** — Alcanza calidad de código de nivel profesional.
- **10x Testing Más Rápido** — De horas a minutos.
- **Curva de Aprendizaje Cero** — No se requiere experiencia en testing.
- **Corrección Automática de Bugs** — La IA parchea problemas automáticamente.

---

## 3. Instalación

Pon en marcha TestSprite MCP Server en tu IDE en menos de 2 minutos.

### Prerrequisitos

1. **IDE Compatible** — Cursor, VS Code, Claude Code, Antigravity, Trae u otros IDEs con soporte MCP.
2. **Cuenta de TestSprite** — [Regístrate gratis](https://www.testsprite.com/auth/cognito/sign-up).
3. **Node.js >= 22** — [Descargar Node.js](https://nodejs.org/) (requerido para ejecutar el servidor MCP).

Para verificar tu versión de Node.js:

```bash
node --version
```

### Obtener Tu Clave API

1. Inicia sesión en tu [Panel de TestSprite](https://www.testsprite.com/dashboard).
2. Navega a **API Keys** dentro de **Settings** (Configuración).
3. Haz clic en **"New API Key"** (Nueva Clave API).
4. Copia tu clave API (la necesitarás para la instalación).

### Instalación por IDE

#### Cursor (Instalación con un clic)

1. Obtén tu [clave API](https://docs.testsprite.com/mcp/getting-started/installation#get-your-api-key).
2. Haz clic en el [enlace de instalación con un clic](cursor://anysphere.cursor-deeplink/mcp/install?name=TestSprite&config=eyJjb21tYW5kIjoibnB4IEB0ZXN0c3ByaXRlL3Rlc3RzcHJpdGUtbWNwQGxhdGVzdCIsImVudiI6eyJBUElfS0VZIjoiIn19).
3. Ingresa tu clave API en Cursor.
4. ¡Comienza a probar!

#### Cursor (Instalación manual)

1. Abre la Configuración de Cursor ( `⌘⇧J` )
2. Navega a **Tools & Integration** (Herramientas e Integración).
3. Haz clic en **Add custom MCP** (Agregar MCP personalizado).
4. Agrega la siguiente configuración:

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "tu-clave-api"
      }
    }
  }
}
```

> **Modo Sandbox de Cursor:** Ve a `Cursor → Settings → Cursor Settings → Chat → Auto-Run → Auto-Run Mode` y cambia la configuración a "Ask Everytime" (Preguntar siempre) o "Run Everything" (Ejecutar todo).

#### Claude Code

1. Navega al directorio de tu proyecto en la terminal:

```bash
cd /ruta/a/tu/proyecto
```

2. Pega el comando de instalación:

```bash
claude mcp add TestSprite --env API_KEY=tu_clave_api -- npx @testsprite/testsprite-mcp@latest
```

3. Reemplaza `tu_clave_api` con tu clave API real de TestSprite.
4. Ejecuta el comando de instalación.
5. Verifica la instalación ejecutando:

```bash
claude mcp list
```

Deberías ver:
```
TestSprite: npx @testsprite/testsprite-mcp@latest - ✓ Connected
```

> **Nota:** Instalar el servidor MCP de esta manera agrega TestSprite solo a Claude Code bajo el directorio del proyecto actual. Si estás usando Claude Code en otro directorio de proyecto, necesitarás agregar el servidor MCP nuevamente.

#### Antigravity

1. Abre la tienda MCP a través del menú desplegable `...` en la parte superior del panel del agente del editor.
2. Haz clic en **"Manage MCP Servers"** (Administrar Servidores MCP).
3. Haz clic en **"View raw config"** (Ver configuración sin formato).
4. Agrega la siguiente configuración a `mcp_config.json`:

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "tu-clave-api"
      }
    }
  }
}
```

#### VS Code

1. Abre la Paleta de Comandos ( `⌘⇧P` ).
2. Ejecuta el comando `MCP: Add Server`.
3. Elige el tipo de instalación **Command (stdio)**.
4. Escribe `npx @testsprite/testsprite-mcp@latest` como comando a ejecutar.
5. Escribe `TestSprite` como identificador/nombre del servidor MCP.
6. Elige el alcance donde quieres configurar el servidor MCP.
7. Agrega la configuración de entorno (`env`):

```json
{
  "servers": {
    "testsprite": {
      "command": "npx",
      "args": ["-y", "@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "tu-clave-api"
      }
    }
  }
}
```

8. Después de la instalación, haz clic en el botón de **start** (iniciar) encima de la entrada del servidor MCP de TestSprite en el archivo `mcp.json` que acabas de configurar.

### Verificación de la Instalación

#### Indicadores de Éxito
- Tu asistente de IA puede ver las herramientas de TestSprite MCP.
- No aparecen errores de "command not found" (comando no encontrado).
- Listo para comenzar a probar tus proyectos.

#### Prueba Rápida

Escribe el siguiente prompt en tu IDE:

```
Ayúdame a probar este proyecto con TestSprite.
```

### Desinstalación

1. Elimina la configuración de los ajustes MCP de tu IDE.
2. Reinicia tu IDE.

---

## 4. Tu Primera Prueba MCP

Experimenta la magia de TestSprite MCP Server con tu primera prueba automatizada en menos de 10 minutos.

1. Asegúrate de tener TestSprite instalado y conectado (punto verde visible en tu IDE).
2. Abre cualquier proyecto con código fuente.
3. Escribe en tu asistente de IA: `Ayúdame a probar este proyecto con TestSprite.`
4. TestSprite analizará automáticamente tu código, generará un plan de pruebas, escribirá los tests y los ejecutará.
5. Revisa los resultados en el dashboard de progreso de pruebas.

---

*Traducción al español por [FLY.AI Sovereign Swarm](https://github.com/Ingenieralejo/bisness-fly-ai) — Colombia 🇨🇴*
*Fuente original: [docs.testsprite.com](https://docs.testsprite.com)*

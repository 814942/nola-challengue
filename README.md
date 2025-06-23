# Nola Tech Challenge - Backend

Este servidor implementa una API y un WebSocket Gateway seguro usando NestJS, Redis y PostgreSQL, cumpliendo con los siguientes requerimientos:

- WebSocket Gateway autenticado con JWT.
- Mensaje de bienvenida al conectar.
- Respuesta a mensajes "ping" con "pong {timestamp}".
- Endpoint REST para publicar mensajes, que almacena y publica en Redis.
- Separación de lógica en servicios y handlers.
- Pruebas unitarias básicas.

## URL de Producción

Puedes probar el servidor en producción aquí:

[https://nola-challengue.onrender.com](https://nola-challengue.onrender.com)
<button onclick="navigator.clipboard.writeText('https://nola-challengue.onrender.com')">Copiar URL</button>

> Si el botón no funciona, copia manualmente la URL.

## Ejecución local

1. Clona el repositorio.
2. Instala dependencias:  
   ```bash
   npm install
   ```
3. Levanta Redis y PostgreSQL (puedes usar Docker):
   ```bash
   docker-compose up -d
   ```
4. Ejecuta el servidor:
   ```bash
   npm run start:dev
   ```

## Endpoints principales

### WebSocket

- URL: `wss://nola-challengue.onrender.com`
- Autenticación: JWT en el handshake
- Mensajes soportados:
  - Al conectar: Recibes `Bienvenido {usuario}`
  - Envía: `{ "event": "ping" }` → Recibes: `{ "event": "pong", "data": "{timestamp}" }`

### REST

- `POST /messages`
  - Body: `{ "message": "texto" }`
  - Almacena el mensaje y lo publica en un canal Redis.

## Ejemplo de colección Postman
<details>
<summary>Ver colección Postman (JSON)</summary>

```json
{
	"info": {
		"_postman_id": "05909c21-ae31-4b3c-9be5-9030a40e0c09",
		"name": "Nola Tech",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "13561508"
	},
	"item": [
		{
			"name": "Auth",
			"item": [
				{
					"name": "Sign up",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"// Parsea la respuesta JSON\r",
									"let response = pm.response.json();\r",
									"\r",
									"// Verifica si el token existe en la respuesta\r",
									"if (response.tokens) {\r",
									"    pm.environment.set(\"accessToken\", response.tokens.accessToken);\r",
									"    console.log(\"JWT guardado en auth ✅\");\r",
									"} else {\r",
									"    console.log(\"No se encontró accessToken ❌\");\r",
									"}"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"email\": \"lila_stark@houses.com\",\r\n    \"password\": \"Win3r1sC0mm1nG!\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/sign-up",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"sign-up"
							]
						}
					},
					"response": []
				},
				{
					"name": "Sign in",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"// Parsea la respuesta JSON\r",
									"let response = pm.response.json();\r",
									"\r",
									"// Verifica si el token existe en la respuesta\r",
									"if (response.token) {\r",
									"    pm.environment.set(\"token\", response.token);\r",
									"    console.log(\"JWT guardado en auth ✅\");\r",
									"} else {\r",
									"    console.log(\"No se encontró accessToken ❌\");\r",
									"}"
								],
								"type": "text/javascript",
								"packages": {}
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"email\": \"brand_stark@houses.com\",\r\n    \"password\": \"Win3r1sC0mm1nG!\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/sign-in",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"sign-in"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Create message",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": [
						{
							"key": "token",
							"value": "{{accessToken}}",
							"type": "string"
						},
						{
							"key": "password",
							"value": "{{token}}",
							"type": "string"
						}
					]
				},
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"userId\": \"123\",\r\n    \"message\": \"Hola desde Redis!\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{url}}/messages",
					"host": [
						"{{url}}"
					],
					"path": [
						"messages"
					]
				}
			},
			"response": []
		}
	]
}
```
</details>

## Probar WebSocket Gateway con Postman

### 1. Obtener JWT
- Realizá un POST a `/auth/sign-in` con el email y password de un usuario registrado.
- Copiá el `accessToken` de la respuesta.

### 2. Conectarse al WebSocket
- En Postman, seleccioná **New → Socket.IO Request**.
- En la pestaña **Headers**, agregá:
  ```
  Key: Authorization
  Value: Bearer TU_JWT_AQUI
  ```
  (Reemplazá `TU_JWT_AQUI` por el token obtenido en el paso anterior)

### 3. Subscripciones
- En la pestaña Events deberas subscribirte a dos eventos: pong y message.
- Al conectar, deberías recibir automáticamente:
  ```
  Bienvenido {usuario}
  ```

### 4. Enviar y recibir ping/pong
- En la pestaña Message, escribí:
  ```
  ping
  ```
- Hacé clic en **Send**.
- Deberías recibir:
  ```
  pong {timestamp}
  ```

### 5. Errores comunes
- Si el token es inválido o falta, la conexión se cierra automáticamente.
- Si el puerto o la URL no coinciden, la conexión fallará.

---

**Nota:**  
No es posible probar WebSockets desde Swagger/OpenAPI, ya que solo soporta

## Redis Pub/Sub: Guía de uso y pruebas

### ¿Qué es Redis Pub/Sub?

Redis Pub/Sub es un sistema de mensajería basado en canales. Permite que una parte de la aplicación publique mensajes en un canal y que otras partes (suscriptores) reciban esos mensajes en tiempo real, sin necesidad de consultar una base de datos.

---

### ¿Cómo se usa en este proyecto?

- Cuando realizás un **POST** a `/messages`, el backend:
  1. Almacena el mensaje.
  2. Publica ese mensaje en el canal `messages` de Redis usando el mecanismo Pub/Sub.

- Cualquier servicio o script que esté suscripto al canal `messages` recibirá el mensaje automáticamente.

---

### ¿Cómo probar el flujo Pub/Sub?

#### 1. Levanta todos los servicios con Docker Compose

```sh
docker-compose up --build
```

#### 2. Envía un mensaje usando Postman o curl

```sh
curl -X POST http://localhost:8080/messages \
  -H "Authorization: Bearer TU_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola mundo","userId":"123"}'
```

#### 3. Suscríbete al canal desde la CLI de Redis

En otra terminal, ejecuta:

```sh
docker exec -it nola_redis redis-cli
127.0.0.1:6379> SUBSCRIBE messages
```

Cuando envíes un mensaje, verás algo así en la consola de Redis:

```
1) "message"
2) "messages"
3) "{\"email\":\"usuario@ejemplo.com\",\"message\":\"Hola mundo\",\"timestamp\":\"2025-06-22T22:00:00.000Z\"}"
```

#### 4. (Opcional) Suscríbete desde Node.js

Puedes crear un pequeño script para escuchar mensajes:

```js
const Redis = require('ioredis');
const redis = new Redis({ host: 'localhost', port: 6379 });

redis.subscribe('messages', () => {
  console.log('Suscripto al canal messages');
});

redis.on('message', (channel, message) => {
  console.log(`Mensaje recibido en ${channel}: ${message}`);
});
```

## Descripción breve de la arquitectura

La aplicación está compuesta por los siguientes módulos y servicios principales:

- **Backend NestJS:** Expone endpoints HTTP y WebSocket. Gestiona la autenticación, almacenamiento y publicación de mensajes.
- **PostgreSQL:** Base de datos relacional para persistir usuarios y, opcionalmente, mensajes.
- **Redis:** Utilizado como sistema de mensajería Pub/Sub para distribuir mensajes en tiempo real entre servicios o procesos.
- **Docker Compose:** Orquesta los servicios (backend, base de datos y Redis) para facilitar el desarrollo y despliegue.

### Flujo principal

1. **Autenticación:** Los usuarios se autentican mediante JWT.
2. **Envío de mensajes:**  
   - El endpoint `/messages` recibe mensajes autenticados.
   - El servicio de mensajes almacena el mensaje (en memoria o en la base de datos).
   - El mensaje se publica en un canal Redis (`messages`) usando el patrón Pub/Sub.
3. **Consumo de mensajes:**  
   - Cualquier servicio, microservicio o script suscripto al canal Redis puede recibir los mensajes en tiempo real.

Esta arquitectura desacopla la lógica de publicación y consumo, permitiendo escalar y agregar nuevos consumidores sin modificar el backend principal.

---

### Conclusión conceptual

El patrón Pub/Sub de Redis permite desacoplar la lógica de publicación y consumo de mensajes, facilitando la escalabilidad y la
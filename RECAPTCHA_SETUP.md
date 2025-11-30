# Configuración de Google reCAPTCHA v2

## Resumen
Se ha integrado Google reCAPTCHA v2 en el formulario de login para proteger contra bots y ataques automatizados.

## Configuración Frontend

### Archivos modificados:

1. **`LoginAngular-Frontend/src/index.html`**
   - Agregado script de reCAPTCHA de Google
   - Agregada función global `onRecaptchaSuccess` para manejar el callback

2. **`LoginAngular-Frontend/src/app/login/login.component.html`**
   - Agregado widget de reCAPTCHA antes del botón "Acceder"
   - Site Key: `6Lf2ehwsAAAAAO8cY4AhW5VEUowhNXSAGRXAYOe4`

3. **`LoginAngular-Frontend/src/app/login/login.component.ts`**
   - Agregada variable `recaptchaToken` para almacenar el token
   - Agregada variable `siteKey` con la clave pública
   - Implementada validación antes de enviar el formulario
   - Agregada función `resetRecaptcha()` para limpiar el widget después de cada intento

4. **`LoginAngular-Frontend/src/app/services/user.service.ts`**
   - Actualizado método `login()` para enviar el token de reCAPTCHA al backend

## Configuración Backend

### Archivos modificados:

1. **`LoginAngular-Backend/src/controllers/user.ts`**
   - Agregada función `verifyRecaptcha()` para validar el token con la API de Google
   - Actualizada función `LoginUser()` para verificar el reCAPTCHA antes de procesar el login
   - Si el reCAPTCHA falla, retorna error 400

2. **`LoginAngular-Backend/.env`**
   - Agregada variable `RECAPTCHA_SECRET_KEY` con la clave secreta
   - Secret Key: `6Lf2ehwsAAAAAFhh18o06nmnd2QA_vargi-J3whU`

3. **`LoginAngular-Backend/package.json`**
   - Agregada dependencia `axios` para hacer peticiones HTTP a Google

## Flujo de validación

1. Usuario completa email y password
2. Usuario resuelve el reCAPTCHA (checkbox "No soy un robot")
3. Al hacer clic en "Acceder", el frontend valida que el reCAPTCHA esté completado
4. El token de reCAPTCHA se envía junto con las credenciales al backend
5. Backend verifica el token con la API de Google
6. Si es válido, continúa con el proceso de autenticación normal (2FA)
7. Si no es válido, retorna error y el usuario debe intentar de nuevo

## Seguridad

- **Site Key (Pública)**: Se usa en el frontend y es visible para todos
- **Secret Key (Privada)**: Solo se usa en el backend y NUNCA debe exponerse al frontend
- El token de reCAPTCHA es de un solo uso
- El widget se resetea después de cada intento de login (exitoso o fallido)

## Testing

Para probar la integración:

1. Ejecuta el proyecto: `npm run dev`
2. Navega a `http://localhost:4200`
3. Ve a la página de login
4. Verás el widget de reCAPTCHA
5. Intenta hacer login sin completar el reCAPTCHA → Error
6. Completa el reCAPTCHA y luego ingresa credenciales válidas → Funciona

## Notas importantes

- El reCAPTCHA v2 muestra un checkbox que el usuario debe marcar
- En algunos casos, Google puede mostrar un desafío adicional (seleccionar imágenes)
- El widget se resetea automáticamente después de cada intento
- Si hay problemas de red, el reCAPTCHA puede fallar en cargar

## Documentación oficial

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v2 Documentation](https://developers.google.com/recaptcha/docs/display)
- [Server-side Verification](https://developers.google.com/recaptcha/docs/verify)

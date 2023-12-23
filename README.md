# Sistema de Turnos Médicos - Backend

Este proyecto constituye la parte del backend de un sistema de gestión de turnos médicos. El backend proporciona endpoints para administrar doctores, pacientes, turnos disponibles, y su historial.

## Funcionalidades

1. **Registro y Autenticación de Usuarios:**
   - Los usuarios pueden registrarse como administradores o pacientes.
   - Autenticación basada en tokens para acceder a las rutas protegidas.

2. **Gestión de Doctores:**
   - Agregar un nuevo doctor.
   - Actualizar información de un doctor.
   - Listar todos los turnos por médico.

3. **Gestión de Pacientes:**
   - Ver turnos disponibles por médico.
   - Ver todas las especialidades médicas disponibles.
   - Reservar y cancelar turnos disponibles.

4. **Gestión de Turnos Disponibles:**
   - Crear un nuevo turno disponible.
   - Actualizar un turno disponible.
   - Eliminar un turno disponible.

5. **Historial de Cancelaciones:**
   - Ver historial de cancelaciones de turnos por paciente.

6. **Recuperación de Contraseña:**
   - Envío de correo electrónico para restablecer la contraseña.

7. **Paginación:**
   - Implementación de paginación en algunas rutas para manejar grandes conjuntos de datos.
   - Uso de los parámetros `page` y `limit` para especificar la página y la cantidad de elementos por página.

## Instalación y Configuración

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/Gonza1065/Proyecto-Final-Vortex-IT
   ```
2. **Inicializar el sistema**
   ```bash
   npm install
   npm start
   ```

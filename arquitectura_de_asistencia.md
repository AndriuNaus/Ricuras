## Arquitectura del Sistema de Control de Asistencia

Este sistema centraliza la gestión de asistencia mediante un servidor Node.js alojado en un VPS, el cual actúa como intermediario entre los usuarios (vía WhatsApp) y las bases de datos de Google.

### 1. Actores y Canal de Comunicación
* **Empleados:** Interactúan con el sistema enviando un mensaje para registrar su entrada o salida, proporcionando una fotografía (selfie) y su ubicación GPS actual.
* **Administrador:** Encargado de enviar los horarios del personal y solicitar la generación de reportes.
* **Canal Oficial:** Toda la interacción se realiza mediante la **Meta WhatsApp Cloud API**, garantizando la recepción y envío oficial de los mensajes y archivos multimedia.

---

### 2. Estructura del Servidor Node.js
El servidor procesa la información a través de componentes especializados para mantener la lógica separada e independiente de los servicios externos:

* **Webhook y Router de mensajes:** Es la puerta de entrada. Recibe las alertas de Meta, verifica la firma de seguridad para autenticar el origen y determina quién está escribiendo (empleado, admin o desconocido) para derivar la solicitud al módulo correspondiente.
* **Módulos de Flujo (Interacción con el usuario):**
    * **Marcación:** Pide al empleado la selfie y ubicación, otorgando un plazo máximo de 2 minutos para completar la acción.
    * **Carga de horarios:** Interpreta y guarda la lista de asignaciones enviada por el administrador, validando posibles anomalías.
    * **Comandos Admin:** Procesa órdenes exclusivas (como "reporte" u "hoy") verificando que provengan del número de teléfono autorizado.
* **Núcleo de Lógica de Negocio (`core/`):**
    * **Validaciones:** Comprueba mediante la fórmula de Haversine que la ubicación esté dentro de la geocerca permitida (ej. restaurante o Padel), verifica que exista una alternancia lógica entre entrada y salida, y revisa el lugar asignado.
    * **Motor de Tiempos:** Es el cerebro matemático. Empareja los tramos de horas, y calcula los atrasos, los minutos en margen, fuera de margen y los totales.
    * **Reportes:** Genera archivos en formato Excel o PDF con el resumen mensual usando ExcelJS o PDFKit.
* **Tareas Programadas (Cron Jobs):** Utiliza `node-cron` para automatizar avisos como recordatorios a las 23:00, notificaciones de tardanza y la emisión de resúmenes semanales.

---

### 3. Flujo de una Marcación Paso a Paso

| Paso | Acción del Sistema |
| :--- | :--- |
| **1** | El empleado envía "entrada" o "salida" al número de WhatsApp. |
| **2** | Meta notifica al webhook y el servidor valida la firma criptográfica. |
| **3** | El router verifica en la base de datos si el número pertenece a un empleado activo. Si no, deniega el acceso. |
| **4** | El bot solicita una selfie y la ubicación actual en un solo mensaje, iniciando un temporizador de 2 minutos. |
| **5** | El sistema descarga la fotografía de los servidores de Meta y la almacena en Google Drive. |
| **6** | Se ejecutan las validaciones: distancia de la geocerca asignada ese día, alternancia (entrada/salida) y concordancia con la hora del servidor. |
| **7** | Se guarda el registro crudo indicando si es `VÁLIDO` o `RECHAZADO`, adjuntando el motivo en caso de falla. |
| **8** | El Motor de Tiempos procesa la acción y actualiza los cálculos de la jornada del día. |
| **9** | El bot responde al empleado en un solo mensaje confirmando la hora del registro o el motivo del rechazo. |

---

### 4. Almacenamiento y Bases de Datos
La persistencia de datos se gestiona mediante el ecosistema de Google. Las imágenes se almacenan en **Google Drive** proporcionando un enlace directo a la base de datos. La información tabular utiliza **Google Sheets** organizada de la siguiente manera:

| Hoja               | Contenido Almacenado                                                                                      | Responsable de llenado               |
| :----------------- | :-------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| **Empleados**      | Nombre, alias, número de teléfono y estado (activo/inactivo).                                             | Administrador.                       |
| **Turnos**         | Plantillas de turnos (tipo de día, entrada, salidas, tramos, margen, lugar).                              | Administrador.                       |
| **Horario_Diario** | Asignación específica por fecha, empleado, lugar y turno.                                                 | El Bot (leyendo la lista del admin). |
| **Registros**      | Información inmutable de cada marcación: hora real, ubicación, distancia, foto, estado y motivo.          | El Bot.                              |
| **Jornadas**       | Tramos emparejados, tiempo total trabajado, atrasos y desglose de minutos (en margen/después del margen). | Motor de Tiempos.                    |
| **Resumen**        | Acumulados y totales semanales/mensuales por cada empleado.                                               | Motor de Tiempos.                    |
|                    |                                                                                                           |                                      |


#links

https://www.instagram.com/ricurasdesalydulce/
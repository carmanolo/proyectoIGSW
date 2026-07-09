"use strict";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/configEnv.js";

/**
 * Servicio para enviar correos electrónicos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} text - Contenido en texto plano
 * @param {string} html - Contenido en formato HTML
 * @returns {Promise} - Resultado del envío
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    // Validar que las credenciales estén configuradas
    if (!EMAIL_USER || !EMAIL_PASS) {
      throw new Error("EMAIL_USER o EMAIL_PASS no están configurados en .env");
    }

    console.log("[Email Service] Configurando transporter...");

    // Configurar el transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Configurar las opciones del correo
    const mailOptions = {
      from: `"Sistema IGSW" <${EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email Service] Correo enviado exitosamente:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[Email Service] Error al enviar correo:", error.message);
    throw new Error("Error enviando el correo: " + error.message);
  }
};

/**
 * Enviar recordatorio de clase
 */
export const sendClassReminderEmail = async (to, className, date, time) => {
  const subject = `Recordatorio de Clase: ${className}`;
  const text = `Hola,\n\nEste es un recordatorio automático de que tienes una clase (${className}) agendada para el día ${date} a las ${time}.\n\nPor favor, no llegues tarde.\n\nSaludos,\nEscuela de Conductores`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Recordatorio de Clase</h2>
      <p>Hola,</p>
      <p>Este es un recordatorio automático de que tienes una clase agendada:</p>
      <ul>
        <li><strong>Tipo de clase:</strong> ${className}</li>
        <li><strong>Fecha:</strong> ${date}</li>
        <li><strong>Hora:</strong> ${time}</li>
      </ul>
      <p>Por favor, llega con 10 minutos de anticipación.</p>
      <p>Saludos,<br/><strong>Escuela de Conductores</strong></p>
    </div>
  `;
  return sendEmail(to, subject, text, html);
};

/**
 * Enviar aviso de cancelación de clase
 */
export const sendClassCancellationEmail = async (to, className, date, time) => {
  const subject = `Aviso de Cancelación de Clase: ${className}`;
  const text = `Hola,\n\nTe informamos que tu clase (${className}) agendada para el día ${date} a las ${time} ha sido cancelada.\n\nPor favor, contáctanos para re-agendar.\n\nSaludos,\nEscuela de Conductores`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #E11D48;">Clase Cancelada</h2>
      <p>Hola,</p>
      <p>Te informamos que la siguiente clase ha sido <strong>cancelada</strong>:</p>
      <ul>
        <li><strong>Tipo de clase:</strong> ${className}</li>
        <li><strong>Fecha:</strong> ${date}</li>
        <li><strong>Hora:</strong> ${time}</li>
      </ul>
      <p>Por favor, revisa el portal o contáctanos para volver a agendar.</p>
      <p>Saludos,<br/><strong>Escuela de Conductores</strong></p>
    </div>
  `;
  return sendEmail(to, subject, text, html);
};

/**
 * Enviar notificación a la secretaria
 */
export const sendSecretaryNotificationEmail = async (secretaryEmail, studentName, rut) => {
  const subject = `Nuevo Registro en Lista de Espera - ${studentName}`;
  const text = `Hola,\n\nEl alumno ${studentName} (RUT: ${rut}) se ha registrado en la lista de espera o ha subido una boleta.\n\nPor favor revisa el sistema de gestión.\n\nSaludos,\nSistema`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #059669;">Nuevo Registro en Lista de Espera</h2>
      <p>Hola,</p>
      <p>El sistema ha detectado un nuevo registro o subida de boleta:</p>
      <ul>
        <li><strong>Alumno:</strong> ${studentName}</li>
        <li><strong>RUT:</strong> ${rut}</li>
      </ul>
      <p>Por favor, ingresa al panel de administración para validar este registro.</p>
      <p>Saludos,<br/><strong>Sistema IGSW</strong></p>
    </div>
  `;
  return sendEmail(secretaryEmail, subject, text, html);
};

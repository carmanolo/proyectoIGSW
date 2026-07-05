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

import cron from 'node-cron';
import { AppDataSource } from '../config/configDb.js';
import { Clase } from '../entities/clase.entity.js';
import { sendClassReminderEmail } from '../services/email.service.js';

export const startClassReminderCron = () => {
  // Ejecutar todos los días a las 08:00 AM
  // Formato: Minuto Hora DíaMes Mes DíaSemana
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Iniciando verificación de clases para enviar recordatorios...');
    try {
      const claseRepository = AppDataSource.getRepository(Clase);
      
      // Obtener fecha de mañana (YYYY-MM-DD)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      // Buscar todas las clases de mañana que no estén canceladas, incluyendo a los usuarios
      const clases = await claseRepository.find({
        where: {
          fecha_clase: tomorrowStr
        },
        relations: ['users']
      });

      let remindersSent = 0;

      for (const clase of clases) {
        if (clase.estado_clase === 'cancelada') continue;
        
        if (clase.users && clase.users.length > 0) {
          for (const user of clase.users) {
            if (user.email && user.rol === 'estudiante') {
              try {
                await sendClassReminderEmail(
                  user.email,
                  clase.tipo || 'Clase',
                  clase.fecha_clase,
                  clase.hora_inicio
                );
                remindersSent++;
              } catch (err) {
                console.error(`[CRON] Error enviando recordatorio a ${user.email}:`, err.message);
              }
            }
          }
        }
      }

      console.log(`[CRON] Se enviaron ${remindersSent} recordatorios para las clases del ${tomorrowStr}.`);
    } catch (error) {
      console.error('[CRON] Error al ejecutar cron de recordatorios:', error);
    }
  });

  console.log('[CRON] Tarea de recordatorios de clase programada para ejecutarse a las 08:00 AM diariamente.');
};

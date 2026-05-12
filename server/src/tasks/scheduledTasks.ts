import cron from 'node-cron';
import * as obdService from '../services/obdService';

export const initScheduledTasks = () => {
  // Every 2 minutes: RPM and Speed
  cron.schedule('*/10 * * * * *', async () => {
    console.log('[Cron] Fetching RPM and Speed...');
    try {
      const rpm = await obdService.getRPM();
      const speed = await obdService.getSpeed();
      console.log(`[Cron] RPM: ${rpm.rpm}, Speed: ${speed.speed}`);
    } catch (error) {
      console.error('[Cron] Error fetching RPM/Speed:', error);
    }
  });

  // Every 30 minutes: Fuel Level
  cron.schedule('*/10 * * * * *', async () => {
    console.log('[Cron] Fetching Fuel Level...');
    try {
      const fuel = await obdService.getFuelLevel();
      console.log(`[Cron] Fuel Level: ${fuel.fuel_level}%`);
    } catch (error) {
      console.error('[Cron] Error fetching Fuel Level:', error);
    }
  });

  // Every hour: Diagnostics
  cron.schedule('*/10 * * * * *', async () => {
    console.log('[Cron] Fetching Diagnostics...');
    try {
      const diagnostics = await obdService.getDiagnostics();
      console.log(`[Cron] Diagnostics:`, diagnostics);
    } catch (error) {
      console.error('[Cron] Error fetching Diagnostics:', error);
    }
  });

  console.log('Scheduled tasks initialized.');
};

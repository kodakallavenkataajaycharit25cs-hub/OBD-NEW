import { Router } from 'express';
import * as obdService from '../services/obdService';

const router = Router();

router.get('/rpm', async (req, res) => {
  try {
    const data = await obdService.getRPM();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RPM' });
  }
});

router.get('/speed', async (req, res) => {
  try {
    const data = await obdService.getSpeed();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch speed' });
  }
});

router.get('/fuel_level', async (req, res) => {
  try {
    const data = await obdService.getFuelLevel();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel level' });
  }
});

router.get('/diagnostics', async (req, res) => {
  try {
    const data = await obdService.getDiagnostics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diagnostics' });
  }
});

export default router;

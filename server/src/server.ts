import express from 'express';
import obdRoutes from './routes/obdRoutes';
import { initScheduledTasks } from './tasks/scheduledTasks';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/obd', obdRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  initScheduledTasks();
});

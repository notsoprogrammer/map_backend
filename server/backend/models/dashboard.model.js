import mongoose from 'mongoose';

const DashboardSchema = new mongoose.Schema({
  municipality: { type: String, required: true, unique: true },
  mainDashboardLink: { type: String, required: true },
  farmersProfileLink: { type: String, required: true },
  riceDashboardLink: { type: String, required: true },
  cropsDashboardLink: { type: String, required: true },
  weatherDashboardLink: { type: String, required: true },
});

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

export default Dashboard;

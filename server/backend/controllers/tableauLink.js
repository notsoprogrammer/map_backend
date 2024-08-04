
import asyncHandler from 'express-async-handler';
import Dashboard from '../models/dashboard.model.js';

const getDashboardLinks = asyncHandler(async (req, res) => {
  console.log("getDashboardLinks called");
  console.log("User in getDashboardLinks:", req.user);

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const userMunicipality = req.user.municipality;
  if (!userMunicipality) {
    res.status(400);
    throw new Error('Municipality not provided');
  }

  const dashboard = await Dashboard.findOne({ municipality: userMunicipality });
  if (dashboard) {
    res.json({
      mainDashboardLink: dashboard.mainDashboardLink,
      farmersProfileLink: dashboard.farmersProfileLink,
      riceDashboardLink: dashboard.riceDashboardLink,
      cropsDashboardLink: dashboard.cropsDashboardLink,
      weatherDashboardLink: dashboard.weatherDashboardLink,
    });
  } else {
    res.status(404);
    throw new Error('Dashboard not found for this municipality');
  }
});

const addDashboardLinks = asyncHandler(async (req, res) => {
  console.log("addDashboardLinks called");
  const { municipality, mainDashboardLink, farmersProfileLink, riceDashboardLink, cropsDashboardLink, weatherDashboardLink } = req.body;

  const dashboardExists = await Dashboard.findOne({ municipality });
  if (dashboardExists) {
    res.status(400);
    throw new Error('Dashboard links already exist for this municipality');
  }

  const dashboard = new Dashboard({
    municipality,
    mainDashboardLink,
    farmersProfileLink,
    riceDashboardLink,
    cropsDashboardLink,
    weatherDashboardLink,
  });

  const createdDashboard = await dashboard.save();
  res.status(201).json(createdDashboard);
});

export { getDashboardLinks, addDashboardLinks };


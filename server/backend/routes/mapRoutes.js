import { getMaps, getMetadata } from "../controllers/mapController.js";

import express from 'express';

const router = express.Router();

// router.get('/map/:filename', getMaps);
router.get('/map/:municipality/:mapType/:dataType', getMaps);
router.get('/metadata/:municipality/:mapType/:dataType', getMetadata);

export default router;
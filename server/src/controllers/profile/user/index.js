const express = require('express');
const router = express.Router();
const profileRoutes = require("../../../api/profile/user/use-put");

// Ensure JSON payloads are parsed for profile routes
router.use(express.json());

// The router at `src/routes/router.js` mounts this file at `/profile`.
// Mount the API sub-router from `api/profile/user/use-put` under this router
// so the combined route becomes `/profile/user`.
router.use('/', profileRoutes);

module.exports = router;
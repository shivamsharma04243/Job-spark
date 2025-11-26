const express = require('express');
const router = express.Router();
const userputprofile = require("../../../api/profile/user/user-put");
const userGetRoutes = require("../../../api/profile/user/user-get");
// Ensure JSON payloads are parsed for profile routes
router.use(express.json());
router.use(userGetRoutes);

// The router at `src/routes/router.js` mounts this file at `/profile`.
// Mount the API sub-router from `api/profile/user/use-put` under this router
// so the combined route becomes `/profile/user`.
router.use('/', userputprofile);

module.exports = router;
'use strict';

const userSettingsRoutes = function(app) {
	const controller = require('../controllers/userSettingsController');

  app.route('/:userId/settings')
    .get(controller.read_user_settings)
    .post(controller.save_user_settings);

};

module.exports = userSettingsRoutes;

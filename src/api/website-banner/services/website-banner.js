'use strict';

/**
 * website-banner service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-banner.website-banner');

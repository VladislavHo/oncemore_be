const { rateLimit } = require('express-rate-limit');

module.exports = rateLimit({
	windowMs: 15 * 60 * 10000, // 15 minutes
	limit: 2000,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})
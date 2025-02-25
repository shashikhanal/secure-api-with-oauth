import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

export default (app) => {
	app.get('/', (req, res) => {
		res.send({
			message: 'Public endpoint',
			isAuthenticated: req.oidc.isAuthenticated()
		});
	});

	// Login status endpoint
	app.get('/auth/status', (req, res) => {
		res.send({
			isAuthenticated: req.oidc.isAuthenticated(),
			user: req.oidc.isAuthenticated() ? req.oidc.user : null
		});
	});

	// User profile endpoint - requires authentication
	app.get('/profile', requiresAuth(), (req, res) => {
		res.send({
			user: req.oidc.user
		});
	});

	app.get('/protected', requiresAuth(), (req, res) => {
		res.send({
			message: 'Protected endpoint',
			user: req.oidc.user
		});
	});
};
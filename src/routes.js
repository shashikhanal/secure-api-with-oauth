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

	// Token endpoint - requires authentication
	app.get('/auth/token', requiresAuth(), async (req, res) => {
		try {
			if (!req.oidc.accessToken) {
				throw new Error('No access token available');
			}

			res.send({
				access_token: req.oidc.accessToken,
				token_type: 'Bearer',
				user: req.oidc.user
			});
		} catch (error) {
			console.error('Token error:', error);
			res.status(500).send({
				error: 'Could not retrieve access token',
				details: error.message
			});
		}
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
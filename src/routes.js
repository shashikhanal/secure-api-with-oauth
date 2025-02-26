import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;
import { auth as requireJWT } from 'express-oauth2-jwt-bearer';
import { checkPermissions } from './middleware/checkPermissions.js';

const jwtCheck = requireJWT({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	tokenSigningAlg: 'RS256'
});

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

	// User profile endpoint - requires read:profile permission
	app.get('/profile',
		jwtCheck,
		checkPermissions(['read:profile']),
		(req, res) => {
			res.send({
				user: req.auth
			});
	});

	// Protected API endpoint - requires read:messages permission
	app.get('/protected',
		jwtCheck,
		checkPermissions(['read:admin-messages']), // read:messages
		(req, res) => {
			res.send({
				message: 'Protected endpoint',
				token_details: {
					// Standard JWT claims
					sub: req.auth.sub,
					iss: req.auth.iss,
					aud: req.auth.aud,
					iat: req.auth.iat,
					exp: req.auth.exp,
					// Auth0 specific claims
					azp: req.auth.azp,
					scope: req.auth.scope,
					permissions: req.auth.permissions,
					// Full token payload for reference
					full_payload: req.auth
				}
			});
	});

	// Admin endpoint - requires admin permission
	app.get('/admin',
		jwtCheck,
		checkPermissions(['admin:access']),
		(req, res) => {
			res.send({
				message: 'Admin endpoint',
				admin_data: {
					sensitive: 'This is sensitive admin data',
					user: req.auth
				}
			});
	});
};
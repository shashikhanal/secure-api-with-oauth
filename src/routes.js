import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;
import { auth as requireJWT } from 'express-oauth2-jwt-bearer';

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

	// User profile endpoint - requires session auth
	app.get('/profile', requiresAuth(), (req, res) => {
		res.send({
			user: req.oidc.user
		});
	});

	// Protected API endpoint - requires JWT token
	app.get('/protected', jwtCheck, (req, res) => {
		res.send({
			message: 'Protected endpoint',
			token_details: {
				// Standard JWT claims
				sub: req.auth.sub,  // The subject (usually the user ID)
				iss: req.auth.iss,  // The issuer (Auth0 domain)
				aud: req.auth.aud,  // The audience (your API identifier)
				iat: req.auth.iat,  // Issued at (timestamp)
				exp: req.auth.exp,  // Expiration time (timestamp)

				// Auth0 specific claims
				azp: req.auth.azp,  // Authorized party (client ID)
				scope: req.auth.scope,  // Granted scopes

				// Full token payload for reference
				full_payload: req.auth
			}
		});
	});
};
import 'dotenv/config';
import express from 'express';
import routes from './src/routes.js';
import pkg from 'express-openid-connect';
const { auth } = pkg;

const app = express();
app.use(express.json());

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_SECRET,
	baseURL: process.env.AUTH0_BASE_URL,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	routes: {
		login: '/login',
		callback: '/callback'
	},
	authorizationParams: {
		response_type: 'code',
		audience: process.env.AUTH0_AUDIENCE,
		scope: 'openid profile email',
		// Request all possible permissions (in practice, you might want to request fewer)
		permissions: 'read:profile read:messages admin:access read:admin-messages'
	}
};

// Auth0 authentication middleware
app.use(auth(config));

routes(app);

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});

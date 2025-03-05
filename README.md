> **Note:** This is a part of [this blog post](https://levelup.gitconnected.com/building-secure-apis-oauth-2-0-and-role-based-access-control-rbac-with-auth0-6e1e41e594e9) in Medium.

# Building Secure APIs: OAuth 2.0 and Role-Based Access Control (RBAC) with Auth0

A NodeJs application demonstrating OAuth 2.0 implementation with Auth0, featuring both web authentication and API validation with role-based access control(RBAC).

## Features

- OAuth 2.0 authentication using Auth0
- Role-based access control
- Protected API endpoints
- JWT token validation

## Prerequisites

- NodeJs (v14 or higher)
- Auth0 account
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone git@github.com:shashikhanal/secure-api-with-oauth.git
cd secure-api-with-oauth
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file off of the `.env.example` file in the root directory with your Auth0 credentials:
```env
AUTH0_SECRET=<generate-a-long-random-string>
AUTH0_CLIENT_ID=<client_id>
AUTH0_CLIENT_SECRET=<client_secret>
AUTH0_BASE_URL=<url_running_your_app_in_localhost_eg_http://localhost:3000>
AUTH0_ISSUER_BASE_URL=<base_url_from_auth0>
AUTH0_AUDIENCE=<audience_from_auth0>
```

## Auth0 Setup

1. Create Regular Web Application in Auth0 Dashboard
2. Create API and configure roles and permissions
3. Set up Application URLs:
   - Callback URL: `http://localhost:3000/callback`
   - Logout URL: `http://localhost:3000`
   - Web Origins: `http://localhost:3000`

## Available Endpoints

- `/` - Public endpoint
- `/login` - Login page
- `/auth/status` - Authentication status
- `/auth/token` - Get access token
- `/api/profile` - User profile (requires `read:profile` permission)
- `/api/protected` - Protected data (requires `read:messages` permission)
- `/api/admin` - Admin data (requires `admin:access` permission)

## Usage

1. Start the server:
```bash
npm run dev
```

2. Visit `http://localhost:3000` in your browser

3. For API access, get token and use in requests:
```bash
# Get and get token through web interface (internet browser)
http://localhost:3000/auth/token

# Use token in API requests
curl http://localhost:3000/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## License

MIT

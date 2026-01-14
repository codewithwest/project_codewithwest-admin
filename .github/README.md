# GitHub Actions Setup

This project uses GitHub Actions to automatically build and release the admin panel Electron application.

## Required GitHub Secrets

To enable the build pipeline, you need to configure the following secrets in your GitHub repository:

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `VITE_API_URL` | The GraphQL API endpoint URL | `https://api.codewithwest.com/graphql` |
| `VITE_API_TOKEN` | The integration API token for authentication | `your-integration-token-here` |

### How to Get the API Token

1. Run the backend server
2. Use the CLI tool to create an integration:
   ```bash
   cd project_codewithwest-go
   go run cmd/create-integration/main.go "GitHub Actions"
   ```
3. Copy the generated token
4. Add it as `VITE_API_TOKEN` secret in GitHub

## Workflows

### `release.yml`
- **Trigger**: When a new release is created
- **Purpose**: Builds the Electron app and uploads `.deb` packages to the release
- **Platform**: Linux (x64)

## Local Development

For local development, create a `.env` file in the `project_codewithwest-admin` directory:

```env
VITE_API_URL=http://localhost:4000/graphql
VITE_API_TOKEN=your-local-integration-token
```

**Note**: The `.env` file is gitignored and should never be committed to the repository.

## Build Process

The GitHub Actions workflow will:
1. Checkout the code
2. Install Node.js dependencies
3. Build the Electron app with the environment variables injected
4. Package the app as `.deb` files
5. Upload the packages to the GitHub release

## Security Notes

- **Never commit** API tokens or URLs to the repository
- Use GitHub Secrets for all sensitive configuration
- Rotate tokens regularly for security
- Use different tokens for production and development environments

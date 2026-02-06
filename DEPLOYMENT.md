# Deploying to Azure

## Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is perfect for Next.js applications and includes:
- Free SSL certificate
- Custom domains
- Global CDN
- API support
- CI/CD integration

### Prerequisites
- Azure account ([sign up here](https://azure.microsoft.com/free/))
- GitHub account (or Azure DevOps)
- Azure CLI installed (optional but recommended)

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Static Web App in Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"
   - Fill in the details:
     - Subscription: Select your subscription
     - Resource Group: Create new or use existing
     - Name: Your app name (e.g., "agent-impact-calculator")
     - Plan: Free (for development) or Standard (for production)
     - Region: Choose closest to your users
     - Source: GitHub
     - Sign in to GitHub and authorize Azure
     - Select your repository and branch
     - Build Presets: Next.js
     - App location: `/`
     - Api location: (leave empty)
     - Output location: `out` or leave default

3. **Configure Build Settings**
   
   Azure will automatically create a GitHub Actions workflow file. The default settings should work, but verify:
   
   ```yaml
   app_location: "/"
   api_location: ""
   output_location: ".next"
   ```

4. **Update next.config.js for Static Export** (if needed)
   
   If you want to use static export mode, update your config:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   ```

5. **Deploy**
   - Azure will automatically deploy when you push to your GitHub repository
   - Check the Actions tab in GitHub to see deployment progress
   - Your app will be available at: `https://<app-name>.azurestaticapps.net`

---

## Option 2: Azure App Service

Azure App Service is better if you need:
- Server-side rendering (SSR)
- Full Next.js API routes
- More control over the Node.js environment

### Steps:

1. **Create App Service**
   ```bash
   # Install Azure CLI
   # https://docs.microsoft.com/cli/azure/install-azure-cli
   
   # Login to Azure
   az login
   
   # Create resource group
   az group create --name agent-impact-rg --location eastus
   
   # Create App Service plan (Linux)
   az appservice plan create --name agent-impact-plan --resource-group agent-impact-rg --sku B1 --is-linux
   
   # Create web app with Node.js runtime
   az webapp create --resource-group agent-impact-rg --plan agent-impact-plan --name agent-impact-calculator --runtime "NODE:18-lts"
   ```

2. **Configure Deployment**
   
   Option A: Deploy from GitHub
   ```bash
   az webapp deployment source config --name agent-impact-calculator --resource-group agent-impact-rg --repo-url <your-github-url> --branch main --manual-integration
   ```
   
   Option B: Deploy from local files
   ```bash
   # Build the app
   npm run build
   
   # Create a zip file
   # On Windows PowerShell:
   Compress-Archive -Path * -DestinationPath deploy.zip
   
   # Deploy
   az webapp deployment source config-zip --resource-group agent-impact-rg --name agent-impact-calculator --src deploy.zip
   ```

3. **Configure App Settings**
   ```bash
   # Set Node.js version
   az webapp config appsettings set --resource-group agent-impact-rg --name agent-impact-calculator --settings WEBSITE_NODE_DEFAULT_VERSION="18-lts"
   
   # Set startup command
   az webapp config set --resource-group agent-impact-rg --name agent-impact-calculator --startup-file "npm start"
   ```

4. **Set up Continuous Deployment (Optional)**
   - In Azure Portal, go to your App Service
   - Select "Deployment Center"
   - Choose GitHub as source
   - Authorize and select repository
   - Azure will create a GitHub Actions workflow

5. **Access your app**
   - Your app will be available at: `https://agent-impact-calculator.azurewebsites.net`

---

## Option 3: Using Docker Container (Azure Container Apps)

1. **Create Dockerfile** (if not exists)
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Deploy to Azure Container Apps**
   ```bash
   # Create container registry
   az acr create --resource-group agent-impact-rg --name agentimpactacr --sku Basic
   
   # Build and push image
   az acr build --registry agentimpactacr --image agent-impact-calculator:latest .
   
   # Create container app
   az containerapp create --name agent-impact-calculator --resource-group agent-impact-rg --image agentimpactacr.azurecr.io/agent-impact-calculator:latest --target-port 3000 --ingress external
   ```

---

## Post-Deployment Configuration

### Environment Variables
If your app needs environment variables, set them in Azure:

```bash
az webapp config appsettings set --resource-group agent-impact-rg --name agent-impact-calculator --settings KEY1="value1" KEY2="value2"
```

Or in the Azure Portal:
- Go to your App Service or Static Web App
- Select "Configuration" or "Environment Variables"
- Add your variables

### Custom Domain
1. Go to your resource in Azure Portal
2. Select "Custom domains"
3. Add your domain
4. Configure DNS records as instructed

### SSL Certificate
- Azure provides free SSL certificates for custom domains
- Enable HTTPS-only in the configuration settings

---

## Cost Estimation

- **Static Web Apps**: Free tier available, Standard is ~$9/month
- **App Service**: B1 tier ~$13/month, scale as needed
- **Container Apps**: Pay per usage, typically $5-20/month for small apps

---

## Troubleshooting

### Build Failures
- Check GitHub Actions logs
- Verify package.json scripts are correct
- Ensure all dependencies are in package.json

### Runtime Errors
- Check Application Insights logs in Azure Portal
- Enable logging: `az webapp log config --name <app-name> --resource-group <rg-name> --application-logging filesystem`
- View logs: `az webapp log tail --name <app-name> --resource-group <rg-name>`

### Performance Issues
- Scale up your App Service plan
- Enable caching
- Use Azure CDN for static assets

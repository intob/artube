# Toolbox
This is the frontend for various internal tools. It's a static web app, built using native Web Components.

## Local development
### 1. Run local init script
This downloads dependencies & copies them into `/dist`. This is required due to build optimisations in `buildspec.yml`. Only required `node_modules` are copied into `/dist` during deployment.
```bash
yarn run init-local
```

### 2. Create env.js
In the repository root, create a file called env.js. The following constants must be exported:
```
// URLs must not end with "/"
export const apiOrigin = "https://api.dev.swi-services.ch"
export const cognitoOrigin = "https://swi-auth-dev.auth.eu-central-1.amazoncognito.com"
export const cognitoClientId = "XXXX"
export const cdnOrigin = "https://cdn.dev.swi-services.ch"
```
### 3. Start local webserver
```bash
yarn start
```

## Use VSCode
I recommend that you use VSCode for this project.

VSCode performs much better than most other editors. For web dev, nothing else is required. All the relevant settings & extensions are integrated into the project workspace under `.vscode`.

The following enhancements are configured:
- Automatic linting on save
- Support for Lit (template syntax highlighting)

Both of these plugins perform very well, so the editing experience is not damaged.

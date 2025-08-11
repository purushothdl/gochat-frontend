$projectRoot = "D:\Ad Astra\Practice Code\React\Explorations\gochat-frontend"
$folders = @(
  "src/app/router",
  "src/features/auth/components",
  "src/features/auth/services",
  "src/features/auth/store",
  "src/features/auth/types",
  "src/pages",
  "src/shared/api",
  "src/shared/components/ui"
)

$files = @(
  "src/app/router/Router.tsx",
  "src/features/auth/components/LoginForm.tsx",
  "src/features/auth/components/RegisterForm.tsx",
  "src/features/auth/components/ForgotPasswordForm.tsx",
  "src/features/auth/components/ResetPasswordForm.tsx",
  "src/features/auth/services/auth.service.ts",
  "src/features/auth/store/auth.store.ts",
  "src/features/auth/types/auth.types.ts",
  "src/pages/HomePage.tsx",
  "src/pages/LoginPage.tsx",
  "src/pages/RegisterPage.tsx",
  "src/pages/ProfilePage.tsx",
  "src/pages/ForgotPasswordPage.tsx",
  "src/pages/ResetPasswordPage.tsx",
  "src/shared/api/apiClient.ts",
  "src/shared/components/ui/Button.tsx",
  "src/shared/components/ui/Card.tsx",
  "src/shared/components/ui/Input.tsx",
  "src/shared/components/ui/Label.tsx",
  "src/App.tsx",
  "src/main.tsx"
)

# Create folders
foreach ($folder in $folders) {
  New-Item -Path "$projectRoot/$folder" -ItemType Directory -Force
}

# Create files
foreach ($file in $files) {
  New-Item -Path "$projectRoot/$file" -ItemType File -Force
}

Write-Host "Folder structure and files created successfully!"
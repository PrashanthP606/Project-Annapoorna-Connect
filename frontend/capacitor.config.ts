import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b6d31f3e302f4389b76420b0d705e7af',
  appName: 'Annapoorna Connect',
  webDir: 'dist',
  server: {
    url: 'https://b6d31f3e-302f-4389-b764-20b0d705e7af.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#0f766e',
      showSpinner: true,
      spinnerColor: '#f7f3e9',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Default'
    }
  }
};

export default config;
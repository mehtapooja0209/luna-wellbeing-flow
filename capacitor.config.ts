
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.246251ed60ad47de96bc8c9f4250906d',
  appName: 'luna-wellbeing-flow',
  webDir: 'dist',
  server: {
    url: 'https://246251ed-60ad-47de-96bc-8c9f4250906d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f8f7ff',
      showSpinner: false
    }
  }
};

export default config;

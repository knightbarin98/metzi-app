import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'metzi-app',
  webDir: 'build',
  bundledWebRuntime: false,
  server:{ 
    allowNavigation:['http://192.168.1.71:1337']
  }
};

export default config;

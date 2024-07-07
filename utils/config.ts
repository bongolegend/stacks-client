import config from '../config.json';

interface Config {
  [key: string]: any;
}

const getConfig = (env?: string): Config => {
  if (!env) {
    console.log("EXPO_PUBLIC_ENV: ", process.env.EXPO_PUBLIC_ENV);
    env = process.env.EXPO_PUBLIC_ENV || 'dev';
    console.log(`Using ${env} environment`);
  }
  return config[env];
};

export default getConfig;
import fs from 'fs';
import yaml from 'js-yaml';

interface Config {
  [key: string]: any;
}

const getConfig = (env?: string): Config => {
  if (!env) {
    env = process.env.ENV || 'dev';
  }
  const fileContents = fs.readFileSync('../config.yaml', 'utf8');
  const config: Config = yaml.load(fileContents) as Config;
  return config[env];
};

export default getConfig;
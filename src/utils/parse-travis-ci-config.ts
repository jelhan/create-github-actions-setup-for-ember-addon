import { ConfigurationInterface } from '../index';
import debug from 'debug';
import fs from 'fs';
import path from 'path';
import process from 'process';
import yaml from 'js-yaml';

export default function (): ConfigurationInterface | null {
  const configFile = path.join(process.cwd(), '.travis-ci.yml');

  let configString;
  try {
    configString = fs.readFileSync(configFile, { encoding: 'utf-8' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      debug('No TravisCI configuration found');
      return null;
    }

    throw error;
  }

  const config = yaml.safeLoad(configString, {
    onWarning: console.log,
  });

  if (typeof config !== 'object') {
    console.error(config);
    throw new Error('Parsing .travis-ci.yml failed');
  }
  console.log(config.jobs);

  const browsers = ['chrome', 'firefox'].filter((_) =>
    Object.keys(config.addons).includes(_)
  );
  const nodeVersion = `${config.node_js?.[0]}.x`;

  console.log(config);

  const emberTryScenarios: string[] = config.jobs.include
    .map(({ env }: { env: unknown }): string | null => {
      if (typeof env !== 'string') {
        return null;
      }

      const [key, value] = env.split('=');
      return key === 'EMBER_TRY_SCENARIO' ? value : null;
    })
    .filter((_: string | null) => _ !== null);
  const allowedToFailEmberTryScenarios: string[] = config.jobs.allow_failures
    .map(({ env }: { env: unknown }): string | null => {
      if (typeof env !== 'string') {
        return null;
      }

      const [key, value] = env.split('=');
      return key === 'EMBER_TRY_SCENARIO' ? value : null;
    })
    .filter((_: string | null) => _ !== null);
  const requiredEmberTryScenarios = emberTryScenarios.filter(
    (scenario) => !allowedToFailEmberTryScenarios.includes(scenario)
  );

  return {
    browsers,
    emberTryScenarios: {
      required: requiredEmberTryScenarios,
      allowedToFail: allowedToFailEmberTryScenarios,
    },
    nodeVersion,
  };
}

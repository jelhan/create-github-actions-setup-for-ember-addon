import { ConfigurationInterface } from '../index';
import debug from './debug';
import fs from 'fs';
import path from 'path';
import process from 'process';
import yaml from 'js-yaml';

function determinePackageManager(config: {
  jobs?: {
    include?: {
      script?: string[];
    }[];
  };
}): 'npm' | 'yarn' {
  for (const jobDescription of config.jobs?.include ?? []) {
    const { script } = jobDescription;

    for (const command of script ?? []) {
      if (command.startsWith('npm')) {
        return 'npm';
      }

      if (command.startsWith('yarn')) {
        return 'yarn';
      }
    }
  }

  throw new Error(
    'Could not determine a supported package manager from TravisCI configuration'
  );
}

export default function (): ConfigurationInterface | null {
  const configFile = path.join(process.cwd(), '.travis.yml');

  debug(`Looking for TravisCI configuration at ${configFile}`);

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
  }) as { [key: string]: any } | string | undefined;

  if (typeof config !== 'object') {
    console.error(config);
    throw new Error('Parsing .travis.yml failed');
  }

  const browsers = ['chrome', 'firefox'].filter((_) =>
    Object.keys(config.addons).includes(_)
  );
  const nodeVersion = `${config.node_js?.[0]}.x`;

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

  const packageManager: 'npm' | 'yarn' = determinePackageManager(config);

  return {
    browsers,
    emberTryScenarios: {
      required: requiredEmberTryScenarios,
      allowedToFail: allowedToFailEmberTryScenarios,
    },
    nodeVersion,
    packageManager,
  };
}

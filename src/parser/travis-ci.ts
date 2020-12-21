import { ConfigurationInterface, EmberTryScenario } from '../index';
import debug from '../utils/debug';
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

export default function parseTravisCiConfig(): ConfigurationInterface | null {
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

  const emberTryScenarios: EmberTryScenario[] = config.jobs.include
    .map(({ env }: { env: unknown }) => {
      if (typeof env !== 'string') {
        return null;
      }

      const [key, value] = env.split('=');

      if (key !== 'EMBER_TRY_SCENARIO') {
        return null;
      }

      return {
        scenario: value,
        allowedToFail: config.jobs.allow_failures.some(
          ({ env: envAllowedToFail }: { env: unknown }) => {
            return envAllowedToFail === env;
          }
        ),
      };
    })
    .filter((_: string | null) => _ !== null);

  const packageManager: 'npm' | 'yarn' = determinePackageManager(config);

  return {
    browsers,
    emberTryScenarios,
    nodeVersion,
    packageManager,
  };
}

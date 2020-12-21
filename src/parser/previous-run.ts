import { ConfigurationInterface } from '../index';
import debug from '../utils/debug';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export default function parsePreviousRunConfig(): ConfigurationInterface | null {
  const gitHubActionFile = path.join(process.cwd(), '.github/workflows/ci.yml');

  debug(
    `Looking for configuration in an existing GitHub Actions workflow at ${gitHubActionFile}`
  );

  let gitHubAction;
  try {
    gitHubAction = fs.readFileSync(gitHubActionFile, { encoding: 'utf-8' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      debug('No existing GitHub Actions workflow found');
      return null;
    }

    throw error;
  }

  const previousConfigString = gitHubAction
    .split('\n')
    .filter((_) => _.startsWith('#$'))
    .map((_) => _.substr(2))
    .join('\n');
  if (previousConfigString === '') {
    debug(
      `GitHub Actions workflow does not seem to contain configuration used in previous run`
    );
    return null;
  }

  const previousConfig = yaml.safeLoad(previousConfigString);
  if (previousConfig === null || typeof previousConfig !== 'object') {
    debug(
      `Unable to parse configuration used in previous run: ${previousConfigString}`
    );
    return null;
  }

  const {
    browsers,
    emberTryScenarios,
    nodeVersion,
    packageManager,
  } = previousConfig;

  if (!['npm', 'yarn'].includes(packageManager)) {
    // TODO: warn
    debug(
      `Previous configuration includes invalid package manager ${packageManager}.`
    );
    return null;
  }

  if (!Array.isArray(browsers)) {
    // TODO: warn
    debug(
      `Previous configuration includes an invalid value for browsers. It should be a collection but is ${typeof browsers}`
    );
  }

  return {
    browsers,
    emberTryScenarios,
    nodeVersion,
    packageManager,
  };
}

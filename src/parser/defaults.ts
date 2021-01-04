import { ConfigurationInterface } from '../index';
import { existsSync, readFileSync } from 'fs';
import { major as semverMajor, minVersion as semverMinVersion } from 'semver';
import path from 'path';

/**
 * Determines minimum supported node version by parsing `engines.node` value
 * from project's `package.json`.
 */
function determineNodeVersion(): string {
  let packageJson;
  try {
    packageJson = JSON.parse(
      readFileSync('package.json', { encoding: 'utf-8' })
    );
  } catch (error) {
    throw new Error(
      'Could not read package.json. Please double-check that current working ' +
        'dir is the root folder of your project.'
    );
  }

  const supportedNodeRange = packageJson?.engines?.node;
  if (typeof supportedNodeRange !== 'string') {
    throw new Error(
      'Unable to determine supported node version. Package.json seems to miss ' +
        '`engines.node` key.'
    );
  }

  const minSupportedNodeVersion = semverMinVersion(supportedNodeRange);
  if (!minSupportedNodeVersion) {
    throw new Error(
      'Unable to determine supported node version. Failed to parse `engines.node` ' +
        `value from package.json as semver. It is ${supportedNodeRange}.`
    );
  }

  return semverMajor(minSupportedNodeVersion).toString();
}

/**
 * Determines package manager used by project by existence of either
 * package-lock.json or yarn.lock.
 */
function determinePackageManager() {
  const isNPM = existsSync('package-lock.json');
  const isYarn = existsSync('yarn.lock');

  if (isNPM && isYarn) {
    throw new Error(
      'Unable to determine package manager. Project seems to have both package-lock.json and yarn.lock.'
    );
  }

  if (!isNPM && !isYarn) {
    throw new Error(
      'Unable to determine package manager. Project seems to have neither package-lock.json nor yarn.lock'
    );
  }

  return isNPM ? 'npm' : 'yarn';
}

/**
 * Determines browsers supported by project based on testem.js configuration.
 */
function determineBrowsers(): string[] {
  let testemConfiguration;
  try {
    testemConfiguration = require(path.join(process.cwd(), 'testem.js'));
  } catch (error) {
    throw new Error(
      'Could not calculate testem configuration. Please double-check that current working ' +
        `dir is the root folder of your project.\n${error}`
    );
  }

  return testemConfiguration?.launch_in_ci ?? ['chrome'];
}

export default function (): ConfigurationInterface {
  return {
    browsers: determineBrowsers(),
    emberTryScenarios: [
      {
        scenario: 'ember-lts-3.16',
        allowedToFail: false,
      },
      {
        scenario: 'ember-lts-3.20',
        allowedToFail: false,
      },
      {
        scenario: 'ember-release',
        allowedToFail: false,
      },
      {
        scenario: 'ember-beta',
        allowedToFail: false,
      },
      {
        scenario: 'ember-default-with-jquery',
        allowedToFail: false,
      },
      {
        scenario: 'ember-classic',
        allowedToFail: false,
      },
      {
        scenario: 'ember-canary',
        allowedToFail: true,
      },
      {
        scenario: 'embroider-tests',
        allowedToFail: true,
      },
    ],
    nodeVersion: determineNodeVersion(),
    packageManager: determinePackageManager(),
  };
}

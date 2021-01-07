import execa from 'execa';
import fs from 'fs';
import { mkdtemp, readFile, rmdir } from 'fs/promises';
import os from 'os';
import path from 'path';
import { prepareFixtures } from '../utils/fixtures';

const executable = path.join(
  __dirname,
  '..',
  '..',
  'bin',
  'create-github-actions-setup-for-ember-addon'
);

let tmpDirForTesting: string;

beforeEach(async () => {
  tmpDirForTesting = await mkdtemp(
    path.join(os.tmpdir(), 'create-github-actions-setup-for-ember-addon-tests-')
  );
});
afterEach(async () => {
  await rmdir(tmpDirForTesting, { recursive: true });
});

describe('creates GitHub Actions setup', () => {
  describe('uses default values if no other parser matches', () => {
    const fixturesPath = path.join(__dirname, '..', 'fixtures', 'defaults');
    const scenarios = fs.readdirSync(fixturesPath);

    scenarios.forEach((scenario) => {
      it(`supports scenario: ${scenario}`, async () => {
        await prepareFixtures(
          path.join('defaults', scenario),
          tmpDirForTesting
        );

        await execa(executable, [], {
          cwd: tmpDirForTesting,
        });

        expect(
          await readFile(
            path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
            { encoding: 'utf-8' }
          )
        ).toMatchSnapshot();
      });
    });
  });

  describe('picks up configuration from previous run stored in GitHub Actions workflow', () => {
    const fixturesPath = path.join(
      __dirname,
      '..',
      'fixtures',
      'github-actions'
    );
    const scenarios = fs.readdirSync(fixturesPath);

    scenarios.forEach((scenario) => {
      it(`supports scenario ci.yml.${scenario}`, async () => {
        await prepareFixtures(
          path.join('github-actions', scenario),
          tmpDirForTesting
        );

        await execa(executable, [], {
          cwd: tmpDirForTesting,
        });

        expect(
          await readFile(
            path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
            { encoding: 'utf-8' }
          )
        ).toMatchSnapshot();
      });
    });
  });

  describe('migrates existing TravisCI configration', () => {
    const fixturesPath = path.join(__dirname, '..', 'fixtures', 'travis-ci');
    const scenarios = fs.readdirSync(fixturesPath);

    scenarios.forEach((scenario) => {
      it(`supports scenario .travis.yml.${scenario}`, async () => {
        await prepareFixtures(
          path.join('travis-ci', scenario),
          tmpDirForTesting
        );

        await execa(executable, [], {
          cwd: tmpDirForTesting,
        });

        expect(
          await readFile(
            path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
            { encoding: 'utf-8' }
          )
        ).toMatchSnapshot();
      });
    });
  });
});

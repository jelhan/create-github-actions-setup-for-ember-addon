import execa from 'execa';
import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';

const executable = path.join(
  __dirname,
  '..',
  '..',
  'bin',
  'create-github-actions-setup-for-ember-addon'
);

let tmpDirForTesting: string;

beforeEach(async () => {
  tmpDirForTesting = await fsPromises.mkdtemp(
    path.join(os.tmpdir(), 'create-github-actions-setup-for-ember-addon-tests-')
  );
});
afterEach(async () => {
  await fsPromises.rmdir(tmpDirForTesting, { recursive: true });
});

describe('creates GitHub Actions setup', () => {
  it('uses default values if no TravisCI configuration exists', async () => {
    await execa(executable, [], {
      cwd: tmpDirForTesting,
    });

    expect(
      await fsPromises.readFile(
        path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
        { encoding: 'utf-8' }
      )
    ).toMatchSnapshot();
  });

  describe('picks up configuration from previous run stored in GitHub Actions workflow', () => {
    const fixturesPath = path.join(
      __dirname,
      '..',
      'fixtures',
      '.github',
      'workflows'
    );
    const scenarios = fs.readdirSync(fixturesPath);

    scenarios.forEach((scenario) => {
      it(`supports scenario ${scenario}`, async () => {
        const workflowsPath = path.join(
          tmpDirForTesting,
          '.github',
          'workflows'
        );

        await fsPromises.mkdir(workflowsPath, { recursive: true });
        await fsPromises.copyFile(
          path.join(fixturesPath, scenario),
          path.join(workflowsPath, 'ci.yml')
        );

        await execa(executable, [], {
          cwd: tmpDirForTesting,
        });

        expect(
          await fsPromises.readFile(
            path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
            { encoding: 'utf-8' }
          )
        ).toMatchSnapshot();
      });
    });
  });

  describe('migrates existing TravisCI configration', () => {
    const fixturesPath = path.join(__dirname, '..', 'fixtures');
    const scenarios = fs
      .readdirSync(fixturesPath)
      .filter((_) => _.startsWith('.travis.yml'));

    scenarios.forEach((scenario) => {
      it(`supports scenario ${scenario}`, async () => {
        await fsPromises.copyFile(
          path.join(fixturesPath, scenario),
          path.join(tmpDirForTesting, '.travis.yml')
        );

        await execa(executable, [], {
          cwd: tmpDirForTesting,
        });

        expect(
          await fsPromises.readFile(
            path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
            { encoding: 'utf-8' }
          )
        ).toMatchSnapshot();
      });
    });
  });
});

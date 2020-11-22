import execa from 'execa';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const executable = path.join(
  __dirname,
  '..',
  '..',
  'bin',
  'create-github-actions-setup-for-ember-addon'
);
const fixturesPath = path.join(__dirname, '..', 'fixtures');

let tmpDirForTesting: string;

beforeEach(async () => {
  tmpDirForTesting = await fs.mkdtemp(
    path.join(os.tmpdir(), 'create-github-actions-setup-for-ember-addon-tests-')
  );
});
afterEach(async () => {
  await fs.rmdir(tmpDirForTesting, { recursive: true });
});

describe('creates GitHub Actions setup', () => {
  it('uses default values if no TravisCI configuration exists', async () => {
    await execa(executable, [], {
      cwd: tmpDirForTesting,
    });

    expect(
      await fs.readFile(
        path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
        { encoding: 'utf-8' }
      )
    ).toMatchSnapshot();
  });

  it('migrates existing TravisCI configuration', async () => {
    await fs.copyFile(
      path.join(fixturesPath, '.travis-ci.yml.ember-3.20'),
      path.join(tmpDirForTesting, '.travis-ci.yml')
    );

    await execa(executable, [], {
      cwd: tmpDirForTesting,
    });

    expect(
      await fs.readFile(
        path.join(tmpDirForTesting, '.github', 'workflows', 'ci.yml'),
        { encoding: 'utf-8' }
      )
    ).toMatchSnapshot();
  });
});

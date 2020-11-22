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
});

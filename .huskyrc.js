//function cp(from, to) {
//  return [`cp ${from} ${to}`, `git add ${to}`];
//}

function precommit(...workspaces) {
  return workspaces.map((workspace) => `yarn workspace ${workspace} run precommit`);
}

module.exports = {
  hooks: {
    'pre-commit': [
      `node -r ts-node/register scripts/markdown-source-import.ts --git-add`,
      `lint-staged`,
      ...precommit(`source`),
    ].join(' && '),
  },
};

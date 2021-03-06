import shell from 'shelljs';
import path from 'path';
import commitAnalyzer from '@semantic-release/commit-analyzer';
import chalk from 'chalk';
import buildCommit from 'cz-customizable/buildCommit';
import autocomplete from 'inquirer-autocomplete-prompt';
import Repository from 'lerna/lib/Repository';
import PackageUtilities from 'lerna/lib/PackageUtilities';

import makeDefaultQuestions from './make-default-questions';
import autocompleteQuestions from './autocomplete-questions';

function getAllPackages () {
  return PackageUtilities.getPackages(new Repository());
}

function getChangedPackages () {
  const changedFiles = shell.exec('git diff --cached --name-only', {silent: true})
    .stdout
    .split('\n');

  return getAllPackages()
    .filter(function (pkg) {
      const packagePrefix = path.relative('.', pkg.location) + path.sep;
      for (let changedFile of changedFiles) {
        if (changedFile.indexOf(packagePrefix) === 0) {
          return true;
        }
      }
    })
    .map(function (pkg) {
      return pkg.name
    });
}

function makeAffectsLine (answers) {
  const selectedPackages = answers.packages;
  if (selectedPackages && selectedPackages.length) {
    return `affects: ${selectedPackages.join(', ')}`;
  }
}

function getCommitTypeMessage (type) {
  if (!type) {
    return '🛠  This commit indicates a patch release (0.0.X)'
  }
  return {
    patch: '🛠  This commit indicates a patch release (0.0.X)',
    minor: '✨  This commit indicates a minor release (0.X.0)',
    major: '💥  This commit indicates a major release (X.0.0)',
  }[type];
}

function mergeQuestions(defaultQuestions, customQuestions) {
  const questions = [];
  defaultQuestions.forEach(question => {
    const matchingCustomQuestions = customQuestions.filter(({ name: customQuestionName }) => (customQuestionName === question.name));
    const customQuestion = matchingCustomQuestions.length > 0 && matchingCustomQuestions[0]
    questions.push(customQuestion || question);
  });
  return questions;
}

function makePrompter(makeCustomQuestions = () => []) {
  return function(cz, commit) {
    const allPackages = getAllPackages().map((pkg) => pkg.name);
    const changedPackages = getChangedPackages();

    const defaultQuestions = makeDefaultQuestions(allPackages, changedPackages);
    const customQuestions = makeCustomQuestions(allPackages, changedPackages);
    const questions = mergeQuestions(defaultQuestions, customQuestions);

    console.log(`\nA commit message should be in the format of ${chalk.green('type(scope): subject')}\n`);

    cz.registerPrompt('autocomplete', autocomplete);
    cz.prompt(
      autocompleteQuestions(questions)
    ).then((answers) => {
        if (answers.confirmCommit === 'yes') {
            const affectsLine = makeAffectsLine(answers);
            if (affectsLine) {
                answers.body = `${affectsLine}\n` + answers.body;
            }
            const message = buildCommit(answers);
            commitAnalyzer({}, {
                commits: [{
                    hash: '',
                    message,
                }],
            }, (err, type) => {
                console.log(chalk.green(`\n${getCommitTypeMessage(type)}\n`));
                commit(message);
            });
        } else {
            console.log(chalk.green('Commit has been canceled.'));
        }
    });
  }
}

module.exports = {
  prompter: makePrompter(),
  makePrompter: makePrompter,
};

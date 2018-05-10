import Promise from 'promise';
import chalk from "chalk";
import buildCommit from 'cz-customizable/buildCommit';

module.exports = (allPackages, changedPackages) => ([
    {
        type: 'autocomplete',
        name: 'type',
        message: 'type:',
        choices: [
            {value: 'fix',      name: 'fix:      🛠  A bug fix (Patch release)'},
            {value: 'perf',     name: 'perf:     🛠  A code change that improves performance (Patch release)'},
            {value: 'feat',     name: 'feat:     ✨  A new feature (Minor release)'},
            {value: 'break',    name: 'break:    💥  Incompatible API changes (Major release)'},
            {value: 'test',     name: 'test:     Adding missing tests'},
            {value: 'docs',     name: 'docs:     Documentation only changes'},
            {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
            {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
            {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
            {value: 'revert',   name: 'revert:   Revert to a commit'},
            {value: 'WIP',      name: 'WIP:      Work in progress'}
        ],
    },
    {
        type: 'input',
        name: 'scope',
        message: 'Scope:',
    },
    {
        type: 'input',
        name: 'subject',
        message: 'Message:',
        validate: function(value) {
            return !!value;
        },
    },
    {
        type: 'input',
        name: 'body',
        message: '(optional) Commit description. Use "|" to break new line:\n',
        when: function(answers) {
            return !(answers.type.toLowerCase() === 'break');
        }
    },
    {
        type: 'input',
        name: 'breaking',
        message: 'List any BREAKING CHANGES: \n',
        validate: function(value) {
            return !!value;
        },
        when: function(answers) {
            return answers.type.toLowerCase() === 'break';
        }
    },
    {
        type: 'checkbox',
        name: 'packages',
        'default': changedPackages,
        choices: allPackages,
        message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
    },
    {
        type: 'expand',
        name: 'confirmCommit',
        choices: [
            { key: 'y', name: 'Yes', value: 'yes' },
            { key: 'n', name: 'Abort commit', value: 'no' }
        ],
        message: function(answers) {
            var sep = '###--------------------------------------------------------###';
            console.log(`\n${sep}\n\n ${buildCommit(answers)} \n\n${sep}\n`);
            return 'Are you sure you want to proceed with the commit above?';
        }
    }
]);

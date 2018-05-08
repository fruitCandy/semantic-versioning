import Promise from 'promise';

module.exports = (allPackages, changedPackages) => ([
    {
        type: 'autocomplete',
        name: 'type',
        message: 'Commit type:',
        choices: [
            {value: 'fix',      name: 'fix:      🛠  A bug fix (note: this will indicate a release)'},
            {value: 'feat',     name: 'feat:     ✨  A new feature (note: this will indicate a release)'},
            {value: 'perf',     name: 'perf:     A code change that improves performance'},
            {value: 'break',    name: 'break:     Breaking changes'},
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
        message: 'Commit scope:',
    },
    {
        type: 'input',
        name: 'subject',
        message: 'Commit message:',
        filter: function(value) {
            return value.charAt(0).toLowerCase() + value.slice(1);
        },
        validate: function(value) {
            return !!value;
        },
    },
    {
        type: 'input',
        name: 'body',
        message: '(optional) Commit description. Use "|" to break new line:\n'
    },
    {
        type: 'checkbox',
        name: 'packages',
        'default': changedPackages,
        choices: allPackages,
        message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
    },
]);

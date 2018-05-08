'use strict';

var buildCommit = require('./buildCommit');
var log = require('winston');
var chalk = require('chalk');


var isNotWip = function(answers) {
  return answers.type.toLowerCase() !== 'wip';
};

module.exports = {

  getQuestions: function(config, cz) {

    // normalize config optional options
    var scopeOverrides = config.scopeOverrides || {};
    var messages = config.messages || {};

    messages.type = messages.type || 'Select the type of change that you\'re committing:';
    messages.scope = messages.scope || '\nDenote the SCOPE of this change (optional):';
    messages.customScope = messages.customScope || 'Denote the SCOPE of this change:';
    messages.subject = messages.subject || 'Write a SHORT, IMPERATIVE tense description of the change:\n';
    messages.body = messages.body || 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n';
    messages.breaking = messages.breaking || 'List any BREAKING CHANGES (optional):\n';
    messages.footer = messages.footer || 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n';
    messages.confirmCommit = messages.confirmCommit || 'Are you sure you want to proceed with the commit above?';

    var questions = [
      {
        type: 'list',
        name: 'type',
        message: messages.type,
        choices: config.types
      },
      {
        type: 'input',
        name: 'scope',
        message: messages.customScope,
        validate: function(value) {
            return !!value;
        },
      },
      {
        type: 'input',
        name: 'subject',
        message: messages.subject,
        validate: function(value) {
          return !!value;
        },
        filter: function(value) {
          return value.charAt(0).toLowerCase() + value.slice(1);
        }
      },
      {
        type: 'input',
        name: 'body',
        message: messages.body,
        when: function(answers) {
            if (config.allowBreakingChanges && config.allowBreakingChanges.indexOf(answers.type.toLowerCase()) >= 0) {
                return false;
            }
            return true;
        }
      },
      {
          type: 'input',
          name: 'breaking',
          message: messages.breaking,
          when: function(answers) {
              if (config.allowBreakingChanges && config.allowBreakingChanges.indexOf(answers.type.toLowerCase()) >= 0) {
                  return true;
              }
              return false; // no breaking changes allowed unless specifed
          },
          validate: function(value) {
              return !!value;
          },
      },
      {
        type: 'expand',
        name: 'confirmCommit',
        choices: [
          { key: 'y', name: 'Yes', value: 'yes' },
          { key: 'n', name: 'Abort commit', value: 'no' },
          { key: 'e', name: 'Edit message', value: 'edit' }
        ],
        message: function(answers) {
          var SEP = '###--------------------------------------------------------###';
          log.info('\n' + SEP + '\n' + buildCommit(answers, config) + '\n' + SEP + '\n');
          return messages.confirmCommit;
        }
      }
    ];

    return questions;
  }
};

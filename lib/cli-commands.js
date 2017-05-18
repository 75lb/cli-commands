'use strict'
const commandLineCommands = require('command-line-commands')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

/**
 * @module cli-commands
 */

/**
 * @alias module:cli-commands
 */
class CliCommmands {
  /**
   * @param {object[]} - One or more command definitions.
   */
  constructor (commandDefinitions) {
    if (!commandDefinitions || (commandDefinitions && !commandDefinitions.length)) throw new Error('Command definitions required')
    // validate: every definition must have a command

    let commandName, argv
    try {
      ({ command: commandName, argv } = commandLineCommands(commandDefinitions.map(c => c.name)))
    } catch (err) {
      halt(err)
    }

    /* command can be a module or module path */
    const cmd = commandDefinitions.find(c => c.name === commandName).command
    const command = typeof cmd === 'string' ? require(cmd).create() : cmd

    /* parse the command option */
    let options = {}
    if (command.optionDefinitions) {
      options = commandLineArgs(command.optionDefinitions(), argv)
    }

    /* --help prints the command's usage */
    if (options.help) {
      console.error(commandLineUsage(command.usage()))

    /* otherwise, invoke the command's execute method with the command-line options */
    } else {
      let result
      try {
        Promise.resolve(command.execute(options))
          .then(output => command.cliView ? command.cliView(output, options) : output)
          .then(output => typeof output !== 'undefined' && console.log(output))
          .catch(halt)
      } catch (err) {
        halt(err)
      }
    }
  }
}

function halt (err) {
  const ansi = require('ansi-escape-sequences')
  console.error(ansi.format('Error: ' + err.stack, 'red'))
  process.exit(1)
}

module.exports = CliCommmands

/* TOO MUCH GOING ON IN CONSTRUCTOR */

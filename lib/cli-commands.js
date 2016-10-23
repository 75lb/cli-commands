'use strict'
const commandLineCommands = require('command-line-commands')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

class CliCommmands {
  constructor (commandDefinitions) {
    const { command: commandName, argv } = commandLineCommands(commandDefinitions.map(c => c.name))
    const cmd = commandDefinitions.find(c => c.name === commandName).command
    const command = typeof cmd === 'string' ? require(cmd).create() : cmd

    let options = {}
    if (cmd.optionDefinitions) {
      options = commandLineArgs(cmd.optionDefinitions(), argv)
    }
    if (options.help) {
      console.error(commandLineUsage(cmd.usage()))
    } else {
      cmd.execute(options)
        .then(output => cmd.cliView ? cmd.cliView(output, options) : output)
        .then(console.log)
        .catch(err => console.error(err.stack))
    }
  }
}

module.exports = CliCommmands

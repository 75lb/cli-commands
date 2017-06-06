'use strict'
/**
 * @module cli-commands
 */

/**
 * @alias module:cli-commands
 */
class Commands extends Map {
  start (argv) {
    /* parse command */
    const commandLineCommands = require('command-line-commands')
    let { command, argv: remainingArgv } = commandLineCommands(Array.from(this.keys()), argv)
    const cmd = this.get(command)

    let options = {}
    if (cmd.optionDefinitions) {
      const commandLineArgs = require('command-line-args')
      const options = commandLineArgs(cmd.optionDefinitions(), { argv })
    }
    return cmd.execute(options, remainingArgv)
  }

  add (name, CommandClass) {
    const cmd = new CommandClass()
    cmd._commands = this
    this.set(name, cmd)
  }
}

module.exports = Commands

'use strict'
const TestRunner = require('test-runner')
const CliCommands = require('./')
const a = require('assert')

const runner = new TestRunner()

runner.test('one default command', function () {
  class Command {
    execute (options) {
      return 'one'
    }
  }
  process.argv = [ 'node', 'script' ]
  const commands = new CliCommands()
  commands.add(null, Command)
  const result = commands.start()
  a.strictEqual(result, 'one')
})

runner.test('one non-default command', function () {
  class Command {
    execute (options) {
      return 'one'
    }
  }
  const commands = new CliCommands()
  commands.add('command', Command)
  process.argv = [ 'node', 'script', 'command' ]
  const result = commands.start()
  a.strictEqual(result, 'one')
})
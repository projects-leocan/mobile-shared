import uuid from 'uuid/v4';
import isFunction from 'lodash/isFunction';

import loggerMiddleware from './redux-middleware';
import ConsoleManager from './managers/console';
import Formater from './formater';
import Adapter from './adapter';

class Logger {
  constructor() {
    Logger.LEVELS.forEach(level => {
      this[level] = (...args) => {
        this.log(level, ...args)
      }
    })

    this.session = null
    this.middleware = loggerMiddleware(this)
  }

  static LEVELS = ['debug', 'info', 'warn', 'error']

  static defaultLevel = Logger.LEVELS[0]
  static defaultManager = new ConsoleManager()
  static defaultFormater = new Formater()
  static defaultAdapter = Adapter

  _validateLevel(level) {
    return Logger.LEVELS.includes(level)
  }

  _validateManager(manager) {
    return true
  }
  _validateFormater(formater) {
    return true
  }
  _validateAdapter(adapter) {
    return true
  }

  get level() {
    return this._level || Logger.defaultLevel
  }
  set level(level) {
    if (!this._validateLevel(level)) {
      return this._level = Logger.defaultLevel
    }

    return this._level = level
  }

  get manager() {
    return this._manager || Logger.defaultManager
  }
  set manager(manager) {
    if (!this._validateManager(manager)) {
      return this._manager = Logger.defaultManager
    }

    return this._manager = manager
  }

  get formater() {
    return this._formater || Logger.defaultFormater
  }
  set formater(formater) {
    if (!this._validateFormater(formater)) {
      return this._formater = Logger.defaultFormater
    }

    return this._formater = formater
  }

  get adapter() {
    return this._adapter || Logger.defaultAdapter
  }
  set adapter(adapter) {
    if (!this._validateAdapter(adapter)) {
      return this._adapter = Logger.defaultAdapter
    }

    return this._adapter = adapter
  }

  checkLevel(level) {
    const definedLevel = this.level
    return Logger.LEVELS.indexOf(definedLevel) <= Logger.LEVELS.indexOf(level)
  }

  _log(id, level, ...args) {
    try {
      if (!this.checkLevel(level)) {
        return
      }

      const _id = id || uuid()
      const date = new Date()

      this.manager.write(level, this.formater.format(this.adapter.normalize({level, date, id: _id}, ...args)))
    } catch (e) {
      console.log('Logger error', e)
    }
  }

  log(level, ...args) {
    const id = this.session || null
    this._log(id, level, ...args)
  }

  group(handler) {
    if (!handler || !isFunction(handler)) {
      return
    }
    const session = uuid()
    const localLog = (level, ...args) => this._log(session, level, ...args)
    return handler(localLog)
  }
}

export default Logger

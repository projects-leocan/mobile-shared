'use strict';

const { NativeModules } = require('react-native');

const RNLogger = NativeModules.RNLogger;

const stringify = (item) => {
  let temp
  try {
    temp = JSON.stringify(item, function(key, val) {
      if (typeof val === 'function') {
        return `function ${val.name} () { ... }`;
      }
      return val;
    });
  } catch (e) {
    temp = item.toString()
  }
  return temp
}

const logger = {
  log: (...args) => {
    let result = []
    args.forEach(item => {
      result.push(stringify(item))
    })

    result = result.join(', ')

    return RNLogger.log(result)
  }
}

module.exports = logger;

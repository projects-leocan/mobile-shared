import Manager from '../manager';

class ConsoleManager extends Manager {
  write(level, message) {
    const method = level === 'debug' ? 'log' : level
    console[method](message)
  }
}

export default ConsoleManager

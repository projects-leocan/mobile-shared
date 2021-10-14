import moment from 'moment';

class Formater {
  formatKey = (key, value) => {
    if (!key || !value) {
      return ''
    }
    if (key === 'level') {
      return value.toUpperCase()
    }
    if (key === 'date') {
      return moment(value).format()
    }
    return value
  }

  t = (strings, ...keys) => (...values) => {
    const dict = values[values.length - 1] || {};

    return keys.reduce((acc, key, i) => {
      const value = this.formatKey(key, dict[key]);
      return [...acc, value, strings[i + 1]]
    }, [strings[0]]).join('');
  }

  template = this.t`${'levelCode'}, [${'date'}] ${'level'} : [${'id'}] ${'message'}`

  format = (values) => {
    if (!this.template) {
      return JSON.stringify(values)
    }
    return this.template(values)
  }
}

export default Formater

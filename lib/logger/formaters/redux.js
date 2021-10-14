import Formater from '../formater';

class ReduxFormater extends Formater {
  template = this.t`${'levelCode'}, [${'date'}] ${'level'} : [${'id'}] ${'message'}`
}

export default ReduxFormater

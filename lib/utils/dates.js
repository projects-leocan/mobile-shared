import moment from 'moment';
import I18n from 'react-native-i18n';

export function * datesSeq() {
  yield {
    date: null,
    name: 'Backlog',
    isBacklog: true,
    index: 0
  };
  yield {
    date: moment(),
    name: 'Today',
    index: 1
  };

  let index = 1;

  while (true) {
    const date = moment().add(index, 'days');
    const name = date.format('ddd');
    index = index + 1;
    yield { date, name, index };
  }
}

export const datesRange = (limit = 8) => {
  const seq = datesSeq();
  const dates = []
  let i = 0;
  while(i <= limit) {
    dates.push(seq.next().value)
    i = i + 1;
  }
  return dates;
}

export const dates = datesRange();

export const dateByIndex = (index) => {
  const seq = datesSeq();
  let i = 0;
  let date;
  while(i <= index) {
    date = seq.next().value;
    i = i + 1;
  }
  return date;
}

export function unixPrettyDate(ts) {
    let today = moment();
    let yesterday = moment().subtract(1, 'day');
    let mValue = moment.unix(ts);

    if (today.isSame(mValue, 'day')) {
        return mValue.format('LT');
    } else if (yesterday.isSame(mValue, 'day')) {
        try {
          return I18n.t('base.ubiquitous.yesterday');
        } catch (error) {
          return 'Yesterday';
        }
    } else {
        return mValue.format('ll');
    }
}

export function prettyDate(day) {
  let today = moment();
  let yesterday = moment().subtract(1, 'day');
  let mValue = moment(day);

  if (today.isSame(mValue, 'day')) {
    return 'Today';
  } else if (yesterday.isSame(mValue, 'day')) {
    return 'Yesterday';
  } else {
    return mValue.format('ll');
  }
}

export function unixPrettyTime(ts) {
  const mDate = moment.unix(ts);
  
  if (!mDate.isValid()) {
    return null;
  }

  return mDate.format('LT');
}

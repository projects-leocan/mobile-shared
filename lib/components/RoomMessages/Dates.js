import React from 'react';
import moment from 'moment';

import {
  DatesContainer,
  DateContainer,
  DateText,
  DateSubtext,
  DateStartBg,
  DateEndBg,
  DateFirstHalfBg,
  DateSecondHalfBg
} from './styles';

const Date = ({ day, isStart, isStartSet, isEnd, handleUpdate, ...props }) => (
  <DateContainer onPress={() => handleUpdate(isEnd ? null : isStart ? null : day, isStart || !isStartSet ? 'startDate' : 'endDate')}>
    { isStart && isEnd && <DateFirstHalfBg /> }
    { isStart && isEnd && <DateSecondHalfBg /> }
    { isStart && !isEnd && <DateStartBg /> }
    { !isStart && isEnd && <DateEndBg /> }

    <DateText isActive={isStart || isEnd}>{ moment(day).format('DD') }</DateText>
    <DateSubtext isActive={isStart || isEnd}>{ moment(day).format('MMM') }</DateSubtext>
  </DateContainer>
)

export default Dates = ({ dateRange, startDate, endDate, handleUpdate }) => (
  <DatesContainer horizontal>
    { dateRange.map(day =>
      <Date
        day={day}
        isStart={startDate === day}
        isStartSet={!!startDate}
        isEnd={endDate === day}
        handleUpdate={handleUpdate}
        key={day}
        />
    )}
  </DatesContainer> 
)
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Container,
  RecentlyTaskedHeaderContainer,
  RecentlyTaskedHeader,
  RecentlyTaskedContainer,
  RecentlyTaskedLabel,
  RecentlyTaskedSkipButton,
  RecentlyTaskedSkipText,
  RecentlyTaskedSpacer
} from './styles';

import {
  slate
} from 'rc-mobile-base/lib/styles';

function RecentTasks({ tasksRecent, onSkip, onSelectRecent }) {
  return (
    <Container>
      <RecentlyTaskedHeaderContainer>
        <RecentlyTaskedHeader>{ `Recent tasks`.toUpperCase() }</RecentlyTaskedHeader>
      </RecentlyTaskedHeaderContainer>

      { tasksRecent.map((data, index) =>
        <RecentlyTaskedContainer key={index} isTop={index === 0} onPress={() => onSelectRecent(data)}>
          { data.selectedAsset && data.selectedAction ?
            <RecentlyTaskedLabel>{ `${data.selectedAsset.name}: ${data.selectedAction.label}` }</RecentlyTaskedLabel>
            : data.selectedAsset ?
            <RecentlyTaskedLabel>{ `${data.selectedAsset.name}` }</RecentlyTaskedLabel>
            :
            <RecentlyTaskedLabel>{ data.createdAsset || 'Issue' }</RecentlyTaskedLabel>
          }
          <Icon name="chevron-right" color={slate.color} size={16} />
        </RecentlyTaskedContainer>
      )}

      <RecentlyTaskedSpacer />

      <RecentlyTaskedSkipButton onPress={onSkip}>
        <RecentlyTaskedSkipText>{ `Skip`.toUpperCase() }</RecentlyTaskedSkipText>
      </RecentlyTaskedSkipButton>
    </Container>
  )
}

export default RecentTasks;
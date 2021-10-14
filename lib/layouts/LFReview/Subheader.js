import React from 'react';
import I18n from 'react-native-i18n'
import SearchSubheader from 'rc-mobile-base/lib/components/SearchSubheader';
import SelectionButton from './SelectionButton';

import {
  SubheaderContainer,
  Spacer
} from './styles';

export default Subheader = ({ searchQuery, updateQuery, isShowAll, updateShow }) => (
  <SubheaderContainer>
    <SearchSubheader
      style={{
        container: { width: 400, backgroundColor: 'white', height: 40, marginTop: 10, marginRight: 10 },
        input: { textAlign: 'left', paddingLeft: 20 },
        btn: { top: -5 }
      }}
      searchQuery={searchQuery}
      updateQuery={(t) => updateQuery(t)}
      />

    <Spacer />
    
    <SelectionButton
      label={I18n.t('base.lost-found-review.index.show-all').toUpperCase()}
      handler={() => updateShow(true)}
      isActive={isShowAll}
      />
    <SelectionButton
      label={I18n.t('base.lost-found-review.index.show-only-open').toUpperCase()}
      handler={() => updateShow(false)}
      isActive={!isShowAll}
      />
  </SubheaderContainer>
)
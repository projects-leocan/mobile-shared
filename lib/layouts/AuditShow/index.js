import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux'
// import { Audit } from 'rc-react-shared/native';
import { Audit } from 'rc-mobile-base/lib/components/Audits/Audit';
import I18n from 'react-native-i18n';

import { getById } from './selectors';

const Container = styled.View`
  flex: 1;
`

class AuditShowScene extends Component {
  render() {
    const { audit } = this.props

    return (
      <Container>
        <Audit
          readOnly
          {...audit}

          noteText={I18n.t('inspector.audits.note')}
          photoText={I18n.t('inspector.audits.photo')}
          yesText={I18n.t('base.ubiquitous.yes')}
          noText={I18n.t('base.ubiquitous.no')}
          submitTaskText={I18n.t('inspector.audits.submit-task')}
          addNoteText={I18n.t('inspector.audits.add-note')}
          addPhotoText={I18n.t('inspector.audits.add-photo')}
          saveText={I18n.t('inspector.audits.save')}
          submitText={I18n.t('base.ubiquitous.submit')}
          cancelText={I18n.t('base.ubiquitous.cancel')}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  return ({
    audit: getById(props.navigation.state.params.audit.id)(state)
  })
}

export default connect(mapStateToProps)(AuditShowScene);

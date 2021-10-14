import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux'
// import { Audit } from 'rc-react-shared/native';
import { Audit } from 'rc-mobile-base/lib/components/Audits';
import omit from 'lodash/omit';
import I18n from 'react-native-i18n';
import debounce from 'lodash/debounce';

import { getById } from './selectors';

import { Audits, Inspections } from 'rc-mobile-base/lib/models';

const Container = styled.View`
  flex: 1;
`

class AuditEditScene extends Component {
  state = {
    status: 'paused'
  }

  componentWillUnmount() {
    this.setState({ status: 'paused' })
  }

  handleSubmit = (inspections) => {
    this.setState({ status: 'completed' })
    this.props.navigation.goBack()
  }

  handleRemove = () => {
    this.setState({ status: 'cancelled' })
    this.props.navigation.goBack()
  }

  handleDestroy = (inspections) => {
    const { audit, submit, navigation } = this.props
    const { consumption_type, consumption_id } = navigation.state.params
    console.log(this.state.status);

    submit({ ...omit(audit, ['created_at', 'updated_at']), inspections, consumption_id, consumption_type, status: this.state.status })
    this.setState({status: 'paused'})
  }

  render() {
    const { audit, submit, autosave, navigation } = this.props
    console.log(navigation)

    return (
      <Container>
        <Audit
          {...audit}
          onSubmit={debounce(this.handleSubmit, 500)}
          onCancel={() => navigation.goBack()}
          onPause={() => navigation.goBack()}
          onDestroy={(inspections) => this.handleDestroy(inspections)}
          onRemove={this.handleRemove}

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
          pauseText={I18n.t('base.ubiquitous.pause')}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  return ({
    audit: getById(props.navigation.state.params.audit.id)(state),
  })
}

const mapDispatchToProps = (dispatch) => ({
  submit: (data) => dispatch(Audits.update.tap(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuditEditScene);

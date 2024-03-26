import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux'
import { Alert, View } from 'react-native';
// import { Audit } from 'rc-react-shared/native';
import { Audit } from 'rc-mobile-base/lib/components/Audits';
import omit from 'lodash/omit';
import I18n from 'react-native-i18n';
import debounce from 'lodash/debounce';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { getById } from './selectors';

import { Audits, Inspections } from 'rc-mobile-base/lib/models';
import { compact } from 'lodash';
import insertAudit from 'rc-mobile-base/lib/actions/insertAudit';
import { inspect } from 'util';
import _ from 'lodash';
import { element } from 'prop-types';
import { F } from 'ramda';
const Container = styled.View`
  flex: 1;
`

class AuditEditScene extends Component {
  state = {
    status: 'paused',
    setAllAnswer: false,
    requiredQuestion: "",
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
    this.props.deleteAuditApi()
    this.props.navigation.goBack()
  }

  areAllNotRequired = (inspections) =>{
    for (const section of inspections) {
      for (const question of section.questions) {
        if (question.isRequired) {
          return false;
        }
      }
    }
    return true;
  }
  handleDestroy = (inspections) => {
    const { audit, submit, navigation, route } = this.props
    const { consumption_type, consumption_id, audit: originAudit } = navigation.state.params
    // submit({ ...originAudit, sections: compact(inspections) })
    // navigation.goBack()
    let allAnswer = 0
    let allNotRequiredAnswer = 0
    let newQuestions = []
    let notRequiredQue = []
    const result = this.areAllNotRequired(inspections);

    !_.isEmpty(inspections) && inspections.map((data) =>{
      !_.isEmpty(data.questions) && data.questions.map((que) =>{

        if (que.isRequired === true) {
          if (que.responseType === 'Short answer' || que.responseType === 'Long Answer') {
            !_.isEmpty(que.responseFormArray) && que.responseFormArray.map((res) =>{
              if ('AnswerResultText' in res === false || res.AnswerResultText === "" || res.AnswerResultText === null) {
                newQuestions.push({...que, isSetAnswer: false})
              }
              else{
                newQuestions.push({...que, isSetAnswer: true})
              }
            })
           
          }else if(que.responseType === 'Checkbox' || que.responseType === 'Multiple Choice' || que.responseType === 'Yes / No' || que.responseType === 'Valid / Invalid' || que.responseType === 'Valid / Invalid / N.A.'){
            let answerResultSelected = false
            que.responseFormArray.map((element) =>{  
              if (element.answerResultSelected === true) {
                answerResultSelected = true
              } 
            })
            newQuestions.push({...que, isSetAnswer: answerResultSelected})
          }
        }else if(result === true){
          if(que.responseType === 'Checkbox' || que.responseType === 'Multiple Choice' || que.responseType === 'Yes / No' || que.responseType === 'Valid / Invalid' || que.responseType === 'Valid / Invalid / N.A.'){
            let answerResultSelected = false
              que.responseFormArray.map((element) =>{ 
                if (element.answerResultSelected === true) {
                  answerResultSelected = true
                } 
              })
              notRequiredQue.push({...que, isSetAnswer: answerResultSelected})
          }else  if (que.responseType === 'Short answer' || que.responseType === 'Long Answer') {
            !_.isEmpty(que.responseFormArray) && que.responseFormArray.map((res) =>{
              if ('AnswerResultText' in res === false || res.AnswerResultText === "" || res.AnswerResultText === null) {
                notRequiredQue.push({...que, isSetAnswer: false})
              }
              else{
                notRequiredQue.push({...que, isSetAnswer: true})
              }
            })
          }
        }
      })
    })
   
    !_.isEmpty(newQuestions) && newQuestions.map((que) =>{
      if(que.isSetAnswer === true){
        allAnswer = allAnswer + 1 ;
      }
    })

    !_.isEmpty(notRequiredQue) && notRequiredQue.map((que) =>{
      if(que.isSetAnswer === true){
        allNotRequiredAnswer = allNotRequiredAnswer + 1 ;
      }
    })

    if ((newQuestions.length === allAnswer && allAnswer !== 0) || allNotRequiredAnswer > 0) {
      submit({ ...originAudit, sections: compact(inspections) })
      const { params } = navigation.state;
      if (params.hasOwnProperty('onGoBack')) {
        navigation.goBack();
        params.onGoBack() // trigger onCallback function of Screen 1
      }else{
        navigation.goBack()
      }
      //  alert("Done all answer submit")
   }else{
    if (!_.isEmpty(notRequiredQue) && allNotRequiredAnswer === 0) {
      alert("Please fill at least one answer")
    }else{
      alert("Please fill all required answers")
    }
   }
  }

  render() {
    const { audit, submit, autosave, navigation,auditInsert } = this.props
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <Audit
            {...audit}
            onSubmit={debounce(this.handleSubmit, 500)}
            onCancel={() => navigation.goBack()}
            onPause={() => navigation.goBack()}
            onDestroy={(inspections) => this.handleDestroy(inspections)}
            onRemove={this.handleRemove}
            insertAudit={this.props.addAudit}
            auditId={navigation.state.params.audit.id}
            auditInsert={auditInsert ? auditInsert : null}
            noteText={I18n.t('inspector.audits.note')}
            photoText={I18n.t('inspector.audits.photo')}
            yesText={I18n.t('base.ubiquitous.yes')}
            noText={I18n.t('base.ubiquitous.no')}
            submitTaskText={I18n.t('inspector.audits.submit-task')}
            addNoteText={I18n.t('inspector.audits.add-note')}
            addPhotoText={I18n.t('inspector.audits.add-photo')}
            saveText={I18n.t('inspector.audits.save')}
            submitText={I18n.t('base.ubiquitous.submit')}
            removeText={I18n.t('base.ubiquitous.remove')}
            cancelText={I18n.t('base.ubiquitous.cancel')}
            pauseText={I18n.t('base.ubiquitous.pause')}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  return ({
    audit: getById(props.navigation.state.params.audit.id)(state),
    auditInsert: state.insertAudit.auditInsert 
  })
}

const mapDispatchToProps = (dispatch) => ({
  submit: (data) => dispatch(Audits.update.tap(data)),
  deleteAuditApi: () => {
    dispatch(Audits.delete.tap());
  },
  addAudit: (data) => dispatch(insertAudit.addAudit(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuditEditScene);

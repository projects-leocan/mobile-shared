import React from 'react';
import { SectionList } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome'
import Immutable from 'seamless-immutable';
import { View, Modal, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import findIndex from 'lodash/findIndex';

import ListView from '../ListView';
import Inspection, { matchHotAnswer, isEmpty } from './Inspection';
import { Inspection as MobileInspection } from './Inspection/index.mobile';

import {
  Container,
  Section,
  MobileSection,
  Header,
  Content,
  ContentFooter,
  Button,
  CancelButton,
  PauseButton,
  RemoveButton,
  ButtonText,
  Buttons,
  Overlay,
  Loader,
} from './styles';

import {
  blue,
  red,
  green,
  blueLt,
  orange
} from 'rc-mobile-base/lib/styles';
import { get, map, compact, find, filter, flatten, isEqual } from 'lodash';
import { computedActiveRoom } from 'rc-mobile-base/lib/selectors/rooms';

const BusyOverlay = ({ visible }) => {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => null}
    >
      <Overlay>
        <Loader
          animating
          size="large"
        />
      </Overlay>
    </Modal>
  )
}

BusyOverlay.defaultProps = {
  visible: false,
}

class AuditView extends React.Component {
  componentDidMount() {
    const onInit = this.props.onInit
    onInit && onInit()
  }

  componentWillUnmount() {
    const onDestroy = this.props.onDestroy
    onDestroy && onDestroy(this.props)
  }

  componentWillMount() {
    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height
  }

  render() {
    const {
      name,
      inspections,
      valid,
      readOnly,
      onChange,
      onSubmit,
      onCancel,
      onChangeInspection,
      onPause,
      onRemove,
      onClearValue,

      busy,

      noteText,
      photoText,
      submitText,
      cancelText,
      yesText,
      noText,
      submitTaskText,
      addPhotoText,
      addNoteText,
      saveText,
      pauseText,
      removeText,
      ...props
    } = this.props

    const narrow = this.width <= 500
    const Inpst = narrow ? MobileInspection : Inspection
    const Sec = narrow ? MobileSection : Section;
    // const sectionedInspections = inspections.reduce((pv, inspection, index) => {
    //   if (pv.length && pv[pv.length - 1].title === inspection.question_section) {
    //     pv[pv.length - 1].data.push(inspection)
    //   } else {
    //     pv.push({
    //       title: inspection.question_section,
    //       data: [inspection,]
    //     })
    //   }

    //   return pv;
    // }, [])

    const sectionedInspections = map(inspections, function (item) {
      return {
        title: get(item, 'sectionHead', ''),
        data: get(item, 'questions', [])
      }
    })

    const actionButtons = narrow ?
      (
        <ActionButton
          offsetY={10}
          offsetX={10}
          hideShadow
          bgColor={"rgba(0,0,0,.1)"}
          buttonColor={blue.color}
        >
          {
            onRemove ? (
              <ActionButton.Item buttonColor={red.color} title={removeText} onPress={onRemove}>
                <Icon name="trash" style={{ fontSize: 20, height: 22, color: 'white' }} />
              </ActionButton.Item>
            ) : null
          }
          {/* {
            onCancel ? (
              <ActionButton.Item buttonColor={orange.color} title={cancelText} onPress={onCancel}>
                <Icon name="ban" style={{ fontSize: 20, height: 22, color: 'white' }} />
              </ActionButton.Item>
            ) : null
          }
          {
            onPause ? (
              <ActionButton.Item buttonColor={blueLt.color} title={pauseText} onPress={onPause}>
                <Icon name="pause" style={{ fontSize: 20, height: 22, color: 'white' }} />
              </ActionButton.Item>
            ) : null
          } */}
          {
            onSubmit ? (
              <ActionButton.Item buttonColor={green.color} title={submitText} onPress={onSubmit}>
                <Icon name="paper-plane" style={{ fontSize: 20, height: 22, color: 'white' }} />
              </ActionButton.Item>
            ) : null
          }
        </ActionButton>
      )
      :
      (
        <Buttons>
          {
            onSubmit ? (
              <Button onPress={onSubmit} narrow={narrow}>
                <ButtonText narrow={narrow}>
                  {submitText}
                </ButtonText>
              </Button>
            ) : null
          }
          {/* {
            onPause ? (
              <PauseButton onPress={onPause} disabled={!valid} narrow={narrow}>
                <ButtonText narrow={narrow}>
                  {pauseText}
                </ButtonText>
              </PauseButton>
            ) : null
          }
          {
            onCancel ? (
              <CancelButton onPress={onCancel} narrow={narrow}>
                <ButtonText narrow={narrow}>
                  {cancelText}
                </ButtonText>
              </CancelButton>
            ) : null
          } */}
          {
            onRemove ? (
              <RemoveButton onPress={onRemove} narrow={narrow}>
                <ButtonText narrow={narrow}>
                  {removeText}
                </ButtonText>
              </RemoveButton>
            ) : null
          }
        </Buttons>
      );

    return (
      <Container {...props}>
        <BusyOverlay visible={busy} />
        {
          name ? (
            <Header narrow={narrow} >{name}</Header>
          ) : null
        }
        <Content narrow={narrow}>
          {
            inspections ? (
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={sectionedInspections}
                renderItem={({ item: inspection, index, section }) => {
                  return (
                    <Inpst
                      {...inspection}
                      card={narrow}
                      readOnly={readOnly}
                      // onChange={(field, value) => !readOnly && onChange(inspection.id, field, value)}
                      // onChange={(answer , field, value) => !readOnly && onChange(inspection?.question, answer ,field, value, section?.title)}
                      onChange={(answer, value) => !readOnly && onChange(inspection?.question, answer, value, section?.title)}
                      onClearValue={(data) => onClearValue(data , inspection?.question ,section?.title)}
                      // onChange = {(answer ,data) => console.log("amnswer si =========" , answer ,data)}
                      onChangeInspection={onChangeInspection}
                      noteText={noteText}
                      photoText={photoText}
                      yesText={yesText}
                      noText={noText}
                      submitTaskText={submitTaskText}
                      addNoteText={addNoteText}
                      addPhotoText={addPhotoText}
                      saveText={saveText}
                      cancelText={cancelText}
                    />
                  )
                }
                }
                renderSectionHeader={({ section: { title } }) => (
                  <Sec>{title}</Sec>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<ContentFooter />}
              />
            ) : null
          }
        </Content>

        {readOnly ? null : actionButtons}
      </Container>
    )
  }
}

AuditView.defaultProps = {
  submitText: 'Submit',
  cancelText: 'Cancel',
  pauseText: 'Pause',
  removeText: 'Remove',
}

const validateInspection = (inspection) => {
  const answer = inspection.answer
  if (answer === null || answer === undefined) {
    return false
  }
  return true
}

const checkHot = (inspection) => {
  if (!inspection || isEmpty(inspection.answer) || !inspection.answer_label) {
    return false
  }
  const hot = inspection.hotAnswers
  if (!hot || hot.length === 0) {
    return inspection
  }
  const hotSelected = hot.filter(a => matchHotAnswer(inspection, a))
  return hotSelected.length > 0
}

const markHot = (inspection) => {
  if (checkHot(inspection)) {
    return {
      ...inspection,
      is_hot: true,
    }
  }
  return inspection
}

const prepareInspection = (inspection) => {
  return omit(markHot(inspection), ['options', 'required', 'hotAnswers', 'id'])
}

const prepareInspectionSingle = (inspection) => {
  // return omit(markHot(inspection), ['options', 'required', 'hotAnswers'])
  return omit(markHot(inspection), ['options', 'required'])
}

const output = (inspections) => {
  return inspections.filter(validateInspection).map(prepareInspectionSingle)
}

class AuditLogic extends React.Component {
  state = {
    inspections: Immutable.from(this.props.inspections),
  }

  clearImageObject = (data , inspection ,sectionTitle ) => {
    const inspections = this.state.inspections
    const sectionIndex = findIndex(inspections, function (obj) {
      return get(obj, 'sectionHead', '') === sectionTitle
    })

    this.setState(({ inspections }) => {
      const updatedSection = inspections.map((sectionObj, secIndex) => {
        if (secIndex === sectionIndex) {
          const sectionQuestion = get(sectionObj, 'questions', null)
          const sectionSelectedQuestion = map(sectionQuestion, function (o) {
            if (get(o, 'question', '') === inspection) {
              const fileterArray = filter(get(o, 'answerImageUrls', '') ,function(image) {
               return get(image, 'key', '') !== data
              })
              const finalArray = {
                ...o,
                answerImageUrls:fileterArray
              }
             return finalArray
            } else {
              return o
            }
          })

          const ObjectToSend = {
            ...sectionObj,
            questions: sectionSelectedQuestion
          }
          return ObjectToSend
        } else {
          return sectionObj
        }
      })

      return ({
        inspections: updatedSection
      })
    })
  }


  handleChange = (inspection, answerObj, value, sectionTitle) => {
    setTimeout(() => {
      const inspections = this.state.inspections
      // const inspectionIndex = findIndex(inspections, (i) => i.id === inspection)
      // const inspectionIndex = findIndex(inspections, (i) => {
      //   console.log('---- index ----', i)
      //   return i?.question === inspection
      // })

      const sectionIndex = findIndex(inspections, function (obj) {
        return get(obj, 'sectionHead', '') === sectionTitle
      })

      this.setState(({ inspections }) => {
        const updatedSection = inspections.map((sectionObj, secIndex) => {
          if (secIndex === sectionIndex) {
            const sectionQuestion = get(sectionObj, 'questions', null)
            const sectionSelectedQuestion = map(sectionQuestion, function (o) {

              if (get(o, 'question', '') === inspection) {
                if (value) {
                  return {
                    ...o,
                    answerImageUrls: o.answerImageUrls ? [...o.answerImageUrls, {value:value , key: answerObj}] : [{value:value , key: answerObj}]
                  }
                }
                else {
                  return {
                    ...o,
                    responseFormArray: answerObj
                    // answerResultSelected: true,
                    // answerResultText: value
                  }
                }
              } else {
                return o
              }
            })

            const ObjectToSend = {
              ...sectionObj,
              questions: sectionSelectedQuestion
            }
            return ObjectToSend
          } else {
            return sectionObj
          }
        })

        return ({
          inspections: updatedSection
        })
      })
    }, 0)
  }

  validate = () => {
    // const inspections = this.state.inspections
    // if (!inspections || inspections.length === 0) {
    //   return false
    // }
    // const result = inspections.filter(validateInspection)
    // return result.length > 0
    const inspections = this.state.inspections;

    const mapQuestionArray = flatten(map(compact(inspections), 'questions'));
    const updatedAnswerList = filter(mapQuestionArray, ['answerResultSelected', true])

    return updatedAnswerList.length > 0;
  }

  handleSubmit = (submitHandler) => {
    // if (!this.validate()) {
    //   return null
    // } else {
    // submitHandler(this.props.output(this.state.inspections))
    destroyHandler(this.state.inspections)
    // }
  }

  handleInit = (initHandler) => {
    if (!this.validate()) {
      return null
    }
    initHandler && initHandler(this.props.output(this.state.inspections))
  }

  handleDestroy = (destroyHandler) => {
    // if (!this.validate()) {
    //   return null
    // }
    // destroyHandler && destroyHandler(this.props.output(this.state.inspections))
    destroyHandler && destroyHandler(this.state.inspections)
  }

  handlePause = (pauseHandler) => {
    if (!this.validate()) {
      return null
    }
    pauseHandler && pauseHandler(this.props.output(this.state.inspections))
  }

  handleChangeInspection = (changeHandler) => (inspection) => {
    setTimeout(() => {
      changeHandler && changeHandler(prepareInspectionSingle(this.state.inspections.find(i => i.id == inspection.id)))
    }, 0)
  }

  handleClear = () => {
    this.setState({ inspections: Immutable.from(this.props.inspections) })
  }

  handleCancel = (cancelHandler) => {
    this.handleClear()

    if (cancelHandler) {
      cancelHandler()
    }
  }

  render() {
    if (!this.state.inspections) {
      return null
    }

    return this.props.children({
      inspections: this.state.inspections.slice(0),
      validate: this.validate,
      clearImageObject:this.clearImageObject,
      handleChange: this.handleChange,
      handleSubmit: this.handleSubmit,
      handleCancel: this.handleCancel,
      handleInit: this.handleInit,
      handleChangeInspection: this.handleChangeInspection,
      handlePause: this.handlePause,
      handleDestroy: this.handleDestroy,
    })
  }
}

AuditLogic.defaultProps = {
  output: output,
}

const Audit = ({
  onSubmit,
  onCancel,
  onInit,
  onChangeInspection,
  onDestroy,
  onPause,

  inspections,
  output,
  readOnly,
  ...props
}) => (
  <>
    <Audit.Logic inspections={inspections} output={output}>
      {
        (audit) => {
          return (
            <Audit.View
              {...props}
              readOnly={readOnly}
              valid={audit.validate()}
              inspections={audit.inspections}
              onChange={audit.handleChange}
              onClearValue = {audit.clearImageObject}
              // onSubmit={() => audit.handleSubmit(onSubmit)}
              onSubmit={() => audit.handleDestroy(onDestroy)}
              onCancel={() => audit.handleCancel(onCancel)}
              onInit={() => audit.handleInit(onInit)}
              // onDestroy={() => audit.handleDestroy(onDestroy)}
              onDestroy={() => console.log('--- onDestroy ---')}
              onPause={() => audit.handlePause(onPause)}
              onChangeInspection={audit.handleChangeInspection(onChangeInspection)}
            />
          )
        }
      }
    </Audit.Logic>
  </>
)

Audit.propTypes = {
  header: PropTypes.string,
}

Audit.Header = Header
Audit.Inspection = Inspection
Audit.Logic = AuditLogic
Audit.View = AuditView

export default Audit

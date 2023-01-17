import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import get from 'lodash/get';

import Answer from '../../Answer';
import Actions from '../Actions';

import {
  Container,
  QuestionWrapper,
  Question,
  Comment,
  AnswerWrapper,
  HotAnswerWrapper,
  HotAnswerText,
  Buttons,
  Button,
  YesButton,
  NoButton,
  ButtonText,
  Content,
} from './styles';

import {
  QuestionRow,
  QuestionContent,
  ExtraContent
} from './styles.mobile';

export const isEmpty = (value) => value === undefined || value === null

export const matchHotAnswer = (inspection, answer) => {
  if (isEmpty(inspection.answer) || !answer || !get(answer, 'condition') || isEmpty(get(answer, 'condition.value')) || !get(answer, 'asset')) {
    return false
  }
  if (inspection.question_kind === 'multiTrueFalse') {
    return Object.keys(answer.condition.value).reduce((acc, key) => {
      return acc && answer.condition.value[key] === inspection.answer[key]
    }, true)
  }
  return get(answer, 'condition.value') === inspection.answer
}

export const getHotAnswersToSubmit = (inspection) => {
  const hotAnswers = inspection.hotAnswers
  if (isEmpty(inspection.answer) || !hotAnswers) {
    return null
  }
  return hotAnswers.filter(a => matchHotAnswer(inspection, a))
}

const Inspection = ({
  readOnly,
  onChange,
  onChangeInspection,

  card,

  noteText,
  photoText,
  submitTaskText,
  yesText,
  noText,
  saveText,
  cancelText,
  addNoteText,
  addPhotoText,

  ...props
}) => {
  const hotAnswersToSubmit = getHotAnswersToSubmit(props);

  return (
    <Container>
      <QuestionWrapper {...props} card={card}>
        <Content card={card}>
          <Question card={card}>
            {props.question}
          </Question>

          <Comment numberOfLines={card ? 1 : 2} ellipsisMode={'tail'}>
            {props.question_comment}
          </Comment>

          <AnswerWrapper card={card}>
            <Answer
              {...props}

              card={card}

              readOnly={readOnly}
              value={props.answer}
              onChange={(answer) => {
                onChange('answer', answer.value)
                onChange('answer_label', answer.label)
                onChangeInspection(props)
              }}
            />
          </AnswerWrapper>
        </Content>

        <Actions card={card}>
          <Actions.Note
            card={card}

            readOnly={readOnly}
            active={!!props.note}
            onChange={(note) => {
              onChange('note', note)
              onChangeInspection(props)
            }}
            noteText={noteText}
            addNoteText={addNoteText}
            saveText={saveText}
            cancelText={cancelText}
          />
          <Actions.Photo
            card={card}

            readOnly={readOnly}
            active={!!props.photo}
            photo={props.photo}
            onChange={(photo) => {
              onChange('photo', photo)
              onChangeInspection(props)
            }}
            photoText={photoText}
            addPhotoText={addPhotoText}
            saveText={saveText}
            cancelText={cancelText}
          />
        </Actions>
      </QuestionWrapper>

      {
        hotAnswersToSubmit && hotAnswersToSubmit.length > 0 ? (
          hotAnswersToSubmit.map((answer, index) => {
            const active = props.submitTasks[answer.condition.label]
            const task = `${get(answer, 'asset.name')}${get(answer, 'action.label') ? `:${get(answer, 'action.label')}` : ''}`
            const taskText = `${submitTaskText} (${task.trim()})?`

            return (
              <HotAnswerWrapper key={index} card={card}>
                <HotAnswerText card={card}>
                  {taskText}
                </HotAnswerText>

                <Buttons card={card}>
                  <YesButton
                    active={active === true}
                    onPress={() => {
                      onChange('submitTasks', {
                        ...props.submitTasks,
                        [`${answer.condition.label}`]: true,
                      })
                      onChangeInspection(props)
                    }}
                  >
                    <ButtonText active={active === true}>
                      {yesText}
                    </ButtonText>
                  </YesButton>
                  <NoButton
                    active={active === false}
                    onPress={() => {
                      onChange('submitTasks', {
                        ...props.submitTasks,
                        [`${answer.condition.label}`]: false,
                      })
                      onChangeInspection(props)
                    }}
                  >
                    <ButtonText active={active === false}>
                      {noText}
                    </ButtonText>
                  </NoButton>
                </Buttons>
              </HotAnswerWrapper>
            )
          })
        ) : null
      }
    </Container>
  )
}

Inspection.defaultProps = {
  submitTaskText: 'Submit a task',
  yesText: 'Yes',
  noteText: 'No',
}

// Inspection.propTypes = {
//   question: PropTypes.string.isRequired,
//   onAnswer: PropTypes.func,
// }

export default Inspection

import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import get from 'lodash/get';

import Answer from '../../Answer';
import Actions from '../Actions';
import { getHotAnswersToSubmit } from './index';

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

  ContentColumn,
  OptionsColumn,
  QuestionText,
  CommentText,
  AnswerContainer
} from './styles.mobile';

export const Inspection = ({
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
      <ContentColumn>
        <QuestionText>{ props.question }</QuestionText>
        { props.question_comment ?
          <CommentText>{ props.question_comment }</CommentText>
          : null
        }

        <AnswerContainer>
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
        </AnswerContainer>

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
      </ContentColumn>
      
      <OptionsColumn>
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
      </OptionsColumn>
    </Container>
  )

  return (
    <Container>
      <QuestionWrapper {...props} card={card}>
        <Content card={card}>
          <Question card={card}>
            {props.question}
          </Question>

          <Comment numberOfLines={1} ellipsisMode={'tail'}>
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

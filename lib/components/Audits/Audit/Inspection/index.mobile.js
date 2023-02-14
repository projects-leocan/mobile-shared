import React, { useState } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import get from 'lodash/get';

import Answer from '../../Answer';
import Actions from '../Actions';
import { getHotAnswersToSubmit } from './index';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';


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
  AnswerContainer,
  QuestionImageCellContainer,
  QuestionImageView
} from './styles.mobile';
import { first, isEmpty, compact, map } from 'lodash';

export const Inspection = ({
  readOnly,
  onChange,
  onChangeInspection,
  onClearValue,
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
  const requirePhoto = get(first(get(props, 'responseFormArray', [])), 'logic.requirePhoto', false)
  const requireSignature = get(first(get(props, 'responseFormArray', [])), 'logic.requireSignature', false)

  const questionImageUrls = get(props, 'questionImageUrls', [])

  const [openLargeView, setOpenLargeView] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)

  const onPressFlatList = (index) => {
    setOpenLargeView(!openLargeView)
  }

  const renderQuestionImages = (item, index) => {
    return (
      <QuestionImageCellContainer activeOpacity={0.7}
        onPress={() => {
          onPressFlatList(index)
          setInitialIndex(index)
        }}>
        <QuestionImageView source={{ uri: item }} ></QuestionImageView>
      </QuestionImageCellContainer>
    )
  }

  return (
    <Container>
      <ContentColumn>
        <QuestionText>{props.question}</QuestionText>
        {props.question_comment ?
          <CommentText>{props.question_comment}</CommentText>
          : null
        }

        {!isEmpty(compact(questionImageUrls)) &&
          <>
            <FlatList
              data={compact(questionImageUrls)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 12 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderQuestionImages(item, index)}
            />

            <ImageViewer
              isVisible={openLargeView}
              initialIndex={initialIndex}
              images={map(questionImageUrls, function (obj) { return { url: obj } })}
              toggleTaskImageModal={onPressFlatList}
            />
          </>
        }

        <AnswerContainer>
          <Answer
            {...props}

            card={card}

            readOnly={readOnly}
            value={props.answer}
            onChange={(answer) => {
              // onChange('answer', answer.value)
              // onChange('answer_label', answer.value)
              // onChangeInspection(props)
              onChange(answer)
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
          {/* <Actions.Note
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
          /> */}
          {requireSignature ?
            <Actions.Signature
              card={card}
              onClearValue={onClearValue}
              value={props.answerImageUrls}
              readOnly={readOnly}
              active={props.answerImageUrls && (props.answerImageUrls.some((data) => data.key === 'note'))}
              // active={!!props.note}
              onChange={(note) => {
                onChange('note', note)
                onChangeInspection(props)
              }}
              noteText={noteText}
              addNoteText={addNoteText}
              saveText={saveText}
              cancelText={cancelText}
            />
            : null}
          {requirePhoto
            ?
            <Actions.Photo
              card={card}
              onClearValue={onClearValue}
              value={props.answerImageUrls}
              // value = {props.answerImageUrls&&(props.answerImageUrls.filter((data) => data.key === 'photo'))}
              readOnly={readOnly}
              active={props.answerImageUrls && (props.answerImageUrls.some((data) => data.key === 'photo'))}
              // active={!!props.photo}
              photo={props.photo}
              onChange={(photo) => {
                onChange('photo', photo)
                onChangeInspection(props)
              }}
              photoText={photoText}
              addPhotoText={addPhotoText}
              saveText={saveText}
              cancelText={cancelText}
            /> : null
          }

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

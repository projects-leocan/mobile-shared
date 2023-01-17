import React from 'react';
import { FlatList, InteractionManager } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import I18n from "react-native-i18n";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ActionButton from "react-native-action-button";
import { validateFileType } from 'rc-mobile-base/lib/utils/file-type';
import VideoComponent from 'rc-mobile-base/lib/components/VideoComponent';

import { connect } from "react-redux";

import CellHeader from './cellHeader';
import Item from './item';
import TaskImageViewer from './TaskImageViewer';
import SelectBothModal from "./SelectBothModal";
import TaskMessageChat from './TaskMessageChat';
import SelectedAssets from 'rc-mobile-base/lib/layouts/CreateTask/SelectedAssets';

import {
    Container,
    VideoContainer,
    SubheaderContainer,
    SubheaderStatusText,
    SubheaderStatusTextCopy,
    SubheaderTimeText,
    InformationContainer,
    HorizontalContainer,
    CreateByContainer,
    CreateByImageContainer,
    CreateByImage,
    CreatedByName,
    TaskImageCellContainer,
    TaskImageView,
    TaskVideoView,
    VideoPlayContainer,
    VideoPlayTouchable,
    ButtonContainer,
    ButtonLabel,
    InputOuterContainer,
    HeaderText,
    InputContainer,
    TimeText,
    TimeInputContainer,
    InputField,
    BottomActionButton,
    ItemLabelDesc,
    MessageSendContainer,
    MessageSendTouchable,
    SendMessageImage,
    ButtonIconContainer,
    ButtonIcon,
    ModalImageContainer,
    ModalImageWrapper,
    ModalImageClose,
    CloseModalIcon,
    ChatItemContainer,
    ChatProfileContainer,
    ItemContainer
} from './styles';

import {
    currentTask,
    userSentTask,
    assignmentOptionsSelector,
    taskAssetSelector,
} from "./selectors";
import { computedIndexedUsers } from 'rc-mobile-base/lib/selectors/users';

import {
    taskUpdate,
    taskReassign,
    taskDeparture,
    taskAddPhoto,
    taskAdditionalPhoto,
    tasksToSomeday,
    taskEdit,
    createMessageForTask
} from "rc-mobile-base/lib/actions/updates";

import {
    blue500,
    white,
    green,
    red,
    orange
} from "rc-mobile-base/lib/styles";

import TaskButton from 'rc-mobile-base/lib/layouts/CreateTask/TaskButton';

import { get, isEmpty, map, filter, compact, orderBy, isArray, includes } from 'lodash';
import moment from 'moment';

import icon_send from 'rc-mobile-base/lib/images/icon_send.png';

const isFileTypeVideo = false;
const convertActivity = {
    "type": "convert",
    "text": "CONVERT",
    "translation": "convert",
    "icon": "edit",
    "status": {
        "update_type": "convert"
    },
    "backgroundColor": "#F0C800",
    "color": "#FFF"
}

const finishActivity = {
    "type": "finish",
    "text": "FINISH",
    "translation": "finish",
    "icon": "check",
    "status": {
        "update_type": "completed"
    },
    "backgroundColor": green.color,
    "color": "#FFF"
}

const validateIsEmptyInfo = (info) => {
    if (info != null && info != 'NA') {
        return info
    } else {
        return null
    }
}

class TaskDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowTaskImageModal: false,
            initialTaskImageIndex: 0,
            isTimePickerVisible: false,
            selectedTime: null,
            isSelectBoth: false,
            isShowVideo: false,
            videoSource: null,
            taskMessage: '',
            isAddMoreImage: false
        }

    }

    componentDidMount() {
        // this.props.navigation.setParams({title: `History`})

        // this.props.navigation.setOptions({
        //     title: `Your Updated Title`,
        // })
    }

    customItem = () => {
        const { task, indexUsers } = this.props;
        const user = get(indexUsers, get(task, 'creator_id'));
        const creatorImage = get(user, 'image', null);

        return (
            <CreateByContainer>
                <CreateByImageContainer>
                    {creatorImage ? <CreateByImage source={{ uri: creatorImage }} /> : null}
                </CreateByImageContainer>
                <CreatedByName>{get(task, 'assigned.label', '')}</CreatedByName>
            </CreateByContainer>
        )
    }

    renderRoomGuestInfo = () => {
        const { task } = this.props;
        const roomName = get(task, 'room.name', null);
        const isGuestReq = get(task, 'is_guest_request', false);
        const guestInfo = get(task, 'guest_info', null);

        const guestName = get(guestInfo, 'guest_name', '');
        const checkIn = get(guestInfo, 'checkIn', null) ? moment(get(guestInfo, 'checkIn', null)).format('DD/MM') : null;
        const checkOut = get(guestInfo, 'checkOut', null) ? moment(get(guestInfo, 'checkOut', null)).format('DD/MM') : null;

        return (
            <HorizontalContainer>
                <ItemLabelDesc style={{ flex: 0.4 }} >{roomName}</ItemLabelDesc>
                {isGuestReq ? <ItemLabelDesc style={{ flex: 0.6 }}>{guestName} {checkIn} {checkOut}</ItemLabelDesc> : null}
            </HorizontalContainer>
        )
    }

    toggleTaskImageModal = () => {
        const { isShowTaskImageModal } = this.state;
        this.setState({ isShowTaskImageModal: !isShowTaskImageModal });
    }

    onTaskImageClick = (index) => {
        const { isShowTaskImageModal } = this.state;
        this.setState({ initialTaskImageIndex: index, isShowTaskImageModal: !isShowTaskImageModal });
    }

    onPlayVideo = (uri) => {
        this.setState({ videoSource: uri, isShowVideo: true })
    }

    renderTaskImages = (item, index) => {
        if (isFileTypeVideo) {
            return (
                <TaskImageCellContainer activeOpacity={0.7} onPress={() => this.onPlayVideo(index)}>
                    {/* <TaskImageView source={{ uri: item }} ></TaskImageView> */}
                    <TaskVideoView source={{ uri: item }} />
                    <VideoPlayContainer>
                        <VideoPlayTouchable onPress={() => this.onPlayVideo(item)}>
                            <MaterialIcons name='play-circle-outline' size={30} color={white.color} />
                        </VideoPlayTouchable>
                    </VideoPlayContainer>
                </TaskImageCellContainer>
            )
        } else {
            return (
                <TaskImageCellContainer activeOpacity={0.7} onPress={() => this.onTaskImageClick(index)}>
                    <TaskImageView source={{ uri: item }} ></TaskImageView>
                </TaskImageCellContainer>
            )
        }

    }

    renderTaskImageFooter = () => {
        return (
            <TaskButton
                label={"+ Add More Photo"}
                onPress={() => this.setState({ isAddMoreImage: true })}
                labelStyle={{ textAlign: 'center' }}
                buttonStyle={{
                    borderStyle: 'dashed',
                    padding: 12,
                    height: wp('30') - 40,
                    maxWidth: wp('30%'),
                    marginVertical: 10,
                    marginHorizontal: 5,
                    flexWrap: 'wrap',
                    alignSelf: 'center'
                }}
            />
        )
    }

    renderEmptyTaskImages = () => {
        return (
            <TaskButton
                label={"+ Add More Photo"}
                onPress={() => this.setState({ isAddMoreImage: true })}
                labelStyle={{ textAlign: 'center' }}
                buttonStyle={{
                    borderStyle: 'dashed',
                    padding: 12,
                    height: wp('30') - 40,
                    width: '100%',
                    marginVertical: 10,
                    marginHorizontal: 5,
                    alignSelf: 'center',
                    justifyContent: 'center'
                }}
            />
        )
    }

    showDatePicker = () => {
        this.setState({ isTimePickerVisible: true })
    };

    hideDatePicker = () => {
        this.setState({ isTimePickerVisible: false })
    };

    handleConfirm = (date) => {
        console.warn("A date has been picked: ", moment(date).format('HH:mm'));
        this.setState({ selectedTime: moment(date).format('HH : mm') })
        this.hideDatePicker();
    };

    _handleToggleBoth = () =>
        this.setState({ isSelectBoth: !this.state.isSelectBoth });

    _handleMoveDeparture = () => {
        const { task: { uuid } } = this.props;
        this.props.departureTask({ uuid: uuid });
    };

    _handleSelectBoth = (user, dueDate) => {
        const { task: { uuid } } = this.props;

        this.props.navigation.goBack();
        InteractionManager.runAfterInteractions(() => {
            this.props.reassignTask({ uuid, user, dueDate });
        });
    };

    _updateTask = (status, isTask) => {
        const { task: { uuid }, task } = this.props;
        const validateStatus = get(status, 'update_type', null) ? get(status, 'update_type', null) : status;

        if (validateStatus && validateStatus === "convert") {
            if (validateStatus && validateStatus === "convert") {
                // return this.props.navigation.navigate("ConvertTask", {
                //     task,
                // });
                return;
            }

            InteractionManager.runAfterInteractions(() => {
                this.props.updateTask(uuid, validateStatus);
            });
        } else {
            // if (isTask.asset === null || isTask.asset === "") {
            //   this._handleSubmitValidation("1");
            // } else if (isTask.action === null || isTask.action === "") {
            //   this._handleSubmitValidation("2");
            // } else if (
            //   (isTask.asset === null || isTask.asset === "") &&
            //   (isTask.action === null || isTask.action === "")
            // ) {
            //   this._handleSubmitValidation("3");
            // } else {
            //this.props.navigation.goBack();

            InteractionManager.runAfterInteractions(() => {
                this.props.updateTask(uuid, validateStatus);
            });

            if (validateStatus === 'completed') {
                this.props.navigation.goBack()
            }
        }
        // }
    };

    renderActionItemSection = (activity, task) => {
        if (
            (task.asset === null ||
                task.asset === "" ||
                task.action === null ||
                task.action === "") &&
            get(task, 'is_claimed', false)
        ) {
            if (activity.type !== "close") {
                return (
                    <ActionButton.Item
                        key={convertActivity.status}
                        title={I18n.t(`base.ubiquitous.${convertActivity.translation}`)}
                        buttonColor={convertActivity.backgroundColor}
                        onPress={() => this._updateTask(convertActivity.status, task)}
                    >
                        <Icon name={convertActivity.icon} size={16} color={white.color} />
                    </ActionButton.Item>
                );
            } else {
                return <View />;
            }
        } else {
            if (get(activity, 'type', '') !== 'convert') {
                return (
                    <ActionButton.Item
                        key={activity.status}
                        title={I18n.t(`base.ubiquitous.${activity.translation}`)}
                        buttonColor={activity.backgroundColor}
                        onPress={() => this._updateTask(activity.status, task)}
                    >
                        <Icon name={activity.icon} size={16} color={white.color} />
                    </ActionButton.Item>
                );
            } else {
                return (
                    <ActionButton.Item
                        key={finishActivity.status}
                        title={I18n.t(`base.ubiquitous.${finishActivity.translation}`)}
                        buttonColor={finishActivity.backgroundColor}
                        onPress={() => this._updateTask(finishActivity.status, task)}
                    >
                        <Icon name={finishActivity.icon} size={16} color={white.color} />
                    </ActionButton.Item>
                );
            }
        }
    };

    closeVideo = () => {
        this.setState({ isShowVideo: false })
    }

    capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    onSendTaskMessage = () => {
        const { task, addMessage } = this.props;
        const { taskMessage } = this.state;

        const taskId = get(task, 'id', null);

        if (taskMessage) {
            if (taskId) {
                addMessage({
                    taskId: taskId,
                    message: taskMessage
                })
                this.setState({ taskMessage: '' })
            }
        }
    }

    onAddTaskImage = () => {
        const { additionalPhoto, task } = this.props;
        const taskId = get(task, 'id', null);
        if (this.SelectedAssets) {
            const assetsHolder = get(this, 'SelectedAssets.state.assetsHolder', []);
            additionalPhoto({
                taskId: taskId,
                imageUrls: assetsHolder
            })

            this.setState({ isAddMoreImage: false })
        }
    }

    renderAssetsArray = (taskAsset) => {
        return taskAsset.map((item, index) => {
            return (
                <ItemContainer key={index.toString()}>
                    <ItemLabelDesc>{item}</ItemLabelDesc>
                </ItemContainer>
            )
        })
    }

    render() {
        const { task, asset, user } = this.props;
        const { isShowTaskImageModal, initialTaskImageIndex, isTimePickerVisible, selectedTime, isShowVideo,
            videoSource, taskMessage, isAddMoreImage } = this.state;

        const activeTab = get(this, 'props.navigation.state.params.activeTab', 0);

        const taskImageURLs = compact(get(task, 'image_urls', []))
        const validateActivities = filter(get(task, 'activities', []), function (o) { return o.type !== 'delay' });

        const taskRoom = get(task, 'room', null);
        const taskNameList = get(task, 'mapTasksName', []);
        const isGuestReq = get(task, 'is_guest_request', false);
        // const taskAsset = get(task, 'asset', []);
        // const taskAction = get(task, 'action', []);

        // const validateAssets = get(taskAsset, 'length') > 1 ? taskAsset : taskAsset.toString();
        // const validateAction = get(taskAction, 'length') > 1 ? taskAction : taskAction.toString();

        const isHaveApartmentInfo = get(taskRoom, 'typeKey', null) === 'APPARTMENT';

        const infoAccess = validateIsEmptyInfo(get(taskRoom, 'infoAccess', null));
        const infoWifi = validateIsEmptyInfo(get(taskRoom, 'infoWifi', null));
        const infoGarbage = validateIsEmptyInfo(get(taskRoom, 'infoGarbage', null));
        const infoParking = validateIsEmptyInfo(get(taskRoom, 'infoParking', null));
        const infoImportant = validateIsEmptyInfo(get(taskRoom, 'infoImportant', null));
        const infoOther = validateIsEmptyInfo(get(taskRoom, 'infoOther', null));
        const address = validateIsEmptyInfo(get(taskRoom, 'address', null));
        const buildingName = get(task, 'room.buildingName', null);
        const comment = get(task, 'comment', null);
        const guestStatus = get(task, 'room.guestStatus', null);
        const isCurrentUserTask = includes(get(task, 'assigned.user_ids', []), get(user, 'id', null))

        let taskMessages = [];
        taskMessages = orderBy(get(task, 'fullMessages', []), ['date_ts'], ['asc']);

        if (comment) {
            const commentObj = {
                message: comment,
                user_id: get(user, 'id', null)
            }
            taskMessages = [commentObj, ...taskMessages]
        }

        if (isShowVideo) {
            return (
                <VideoContainer>
                    <VideoComponent
                        videoSource={videoSource}
                        isShowDone={false}
                        closeVideo={this.closeVideo}
                    />
                </VideoContainer>
            )
        }
        return (
            <Container>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    extraScrollHeight={120}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    <SubheaderContainer>
                        {/* <SubheaderStatusText>{`${I18n.t(
                            `base.ubiquitous.${task.category}-task`
                        )}`}</SubheaderStatusText> */}
                       
                       {(get(task, 'category', '') == 'priority' || isGuestReq) ?
                            <>
                            <SubheaderStatusTextCopy>{this.capitalize(task.category)} task</SubheaderStatusTextCopy>
                            <Icon
                                name="star"
                                color={get(task, 'category', '') === 'priority' ? orange.color : red.color}
                                size={30}
                                style={{ flex: 1, left: 10}}
                            />
                            </>
                            :
                            <SubheaderStatusText>{this.capitalize(task.category)} task</SubheaderStatusText>
                        }
                        {get(task, 'created_at', '') ? <SubheaderTimeText>{moment.unix(task.created_at).fromNow()}</SubheaderTimeText> : null}
                    </SubheaderContainer>

                    <InformationContainer>
                        <CellHeader label={I18n.t("maintenance.task.index.information")} />

                        {/* {isArray(validateAssets)
                            ? <Item label={I18n.t("base.ubiquitous.asset")} customItem={this.renderAssetsArray(validateAssets)} />
                            : <Item label={I18n.t("base.ubiquitous.asset")} value={validateAssets} />}
                        {isArray(validateAction)
                            ? <Item label={I18n.t("base.ubiquitous.action")} customItem={this.renderAssetsArray(validateAction)} />
                            : <Item label={I18n.t("base.ubiquitous.action")} value={validateAction} />} */}
                        <Item label={`${I18n.t("base.ubiquitous.asset")} x ${I18n.t("base.ubiquitous.action")}`} customItem={this.renderAssetsArray(taskNameList)} />
                        <Item label={'Assignee'} customItem={this.customItem()} />

                        <TaskImageViewer
                            isVisible={isShowTaskImageModal}
                            initialIndex={initialTaskImageIndex}
                            images={map(taskImageURLs, function (obj) { return { url: obj } })}
                            toggleTaskImageModal={this.toggleTaskImageModal}
                        />

                        <ModalImageContainer isVisible={isAddMoreImage}>
                            <ModalImageWrapper>
                                <ModalImageClose activeOpacity={0.7} onPress={() => this.setState({ isAddMoreImage: false })}>
                                    <CloseModalIcon name="close" />
                                </ModalImageClose>
                                <SelectedAssets
                                    ref={ref => this.SelectedAssets = ref}
                                    onNext={() => this.onAddTaskImage()}
                                />
                            </ModalImageWrapper>
                        </ModalImageContainer>

                        {!isEmpty(taskImageURLs)
                            ?
                            <FlatList
                                data={taskImageURLs}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 12 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderTaskImages(item, index)}
                                ListFooterComponent={() => this.renderTaskImageFooter(true)}
                            /> : this.renderEmptyTaskImages()
                        }

                        {/* <ButtonContainer>
                            <ButtonIconContainer>
                                <ButtonIcon source={require('../../images/icon_pdf.png')} />
                            </ButtonIconContainer>
                            <ButtonLabel>{I18n.t("maintenance.task.index.view-attachments")}</ButtonLabel>
                        </ButtonContainer> */}

                    </InformationContainer>

                    {!isEmpty(taskMessages)
                        ?
                        <InformationContainer>
                            <HeaderText>Message List</HeaderText>
                            <TaskMessageChat
                                taskMessages={taskMessages}
                                user={user}
                            />
                        </InformationContainer>
                        : null
                    }

                    <InformationContainer>
                        {/* <HorizontalContainer>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={this.handleConfirm}
                                onCancel={this.hideDatePicker}
                            />

                            <InputOuterContainer style={{ flex: 0.35, marginRight: 10 }}>
                                <HeaderText>Add Time</HeaderText>
                                <TimeInputContainer activeOpacity={1} onPress={() => this.showDatePicker()}>
                                    <TimeText isShowAsPlaceHolder={selectedTime == null}>{selectedTime ? `${selectedTime} hr` : `00 : 00 hr`}</TimeText>
                                </TimeInputContainer>
                            </InputOuterContainer>

                            <InputOuterContainer style={{ flex: 0.65 }}>
                                <HeaderText>Add Parts</HeaderText>
                                <InputContainer style={{ height: 60 }} >
                                    <InputField
                                        placeholder="Add parts"
                                    />
                                </InputContainer>
                            </InputOuterContainer>
                        </HorizontalContainer> */}

                        <InputOuterContainer>
                            <HeaderText>Message</HeaderText>
                            <InputContainer>
                                <InputField
                                    placeholder="Type here"
                                    multiline={true}
                                    numberOfLines={4}
                                    style={{ height: 120, textAlignVertical: 'top' }}
                                    onChangeText={(input) => this.setState({ taskMessage: input })}
                                    value={taskMessage}
                                />

                                <MessageSendContainer>
                                    <MessageSendTouchable onPress={() => this.onSendTaskMessage()}>
                                        <SendMessageImage source={icon_send} />
                                    </MessageSendTouchable>
                                </MessageSendContainer>
                            </InputContainer>
                        </InputOuterContainer>
                    </InformationContainer>

                    <InformationContainer>
                        <CellHeader label={I18n.t("maintenance.task.index.location-information")} />

                        <Item label={`${I18n.t("base.ubiquitous.room")} / ${I18n.t("base.ubiquitous.guest")}`} customItem={this.renderRoomGuestInfo()} />
                        {guestStatus ? <Item label={`${I18n.t("maintenance.filters.index.guest-status")}`} value={String(guestStatus).toUpperCase()} /> : null}
                        {buildingName
                            ? <Item label={`Location`} value={`${get(task, 'room.name', '')}, ${get(task, 'room.floorName', '')}, ${buildingName}`} />
                            : <Item label={`Location`} value={`${get(task, 'room.name', '')}, ${get(task, 'room.floorName', '')}`} />}
                        {isHaveApartmentInfo ? (
                            <>
                                {infoAccess ? <Item label={`Information Access`} value={infoAccess} /> : null}
                                {infoGarbage ? <Item label={`Information Garbage`} value={infoGarbage} /> : null}
                                {infoParking ? <Item label={`Information Parking`} value={infoParking} /> : null}
                                {address ? <Item label={`Apartment Address`} value={address} /> : null}
                                {infoImportant ? <Item label={`Apartment important`} value={infoImportant} /> : null}
                                {infoOther ? <Item label={`Other Apartment information`} value={infoOther} /> : null}

                            </>
                        ) : null}

                    </InformationContainer>

                    {/* <InformationContainer>
                        <CellHeader label={I18n.t("base.ubiquitous.action")} />

                        <BottomActionButton activeOpacity={0.7} onPress={this._handleToggleBoth} >
                            <Item label={I18n.t("maintenance.task.index.reassign-task")} />
                        </BottomActionButton>

                        <BottomActionButton activeOpacity={0.7} onPress={this._handleMoveDeparture}>
                            <Item label={I18n.t("maintenance.task.index.move-to-departure")} />
                        </BottomActionButton>
                    </InformationContainer> */}

                    <SelectBothModal
                        isVisible={this.state.isSelectBoth}
                        toggleModal={this._handleToggleBoth}
                        currentDate={get(task, 'due_date', '')}
                        userSections={this.props.assignmentOptions}
                        handler={this._handleSelectBoth}
                    />

                </KeyboardAwareScrollView>

                {
                    isCurrentUserTask
                        ? <ActionButton
                            buttonColor={blue500.color}
                            hideShadow={true}
                            offsetY={20}
                            offsetX={20}
                        >
                            {validateActivities.map(activity =>
                                this.renderActionItemSection(activity, task)
                            )}
                        </ActionButton> : null
                }

            </Container >
        )
    }
}

const mapStateToProps = (state, props) => {
    const activeTab = get(props, 'navigation.state.params.activeTab', 0);
    const task = activeTab === 2 ? userSentTask(props.navigation.state.params.task.uuid)(state) : currentTask(props.navigation.state.params.task.uuid)(state);
    const asset = taskAssetSelector(task)(state);

    return {
        task,
        user: state.auth.user,
        assignmentOptions: assignmentOptionsSelector(state),
        indexUsers: computedIndexedUsers(state),
        asset,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        updateTask: (uuid, status) => {
            dispatch(taskUpdate({ uuid, status }));
        },
        addMessage: (taskId, message) => {
            dispatch(createMessageForTask(taskId, message));
        },
        reassignTask: (values) => {
            dispatch(taskReassign(values));
        },
        departureTask: (values) => {
            dispatch(taskDeparture(values));
        },
        addPhoto: (uuid, photoPath) => {
            dispatch(taskAddPhoto({ uuid, photoPath }));
        },
        additionalPhoto: (taskId, imageUrls) => {
            dispatch(taskAdditionalPhoto(taskId, imageUrls));
        },
        moveSomeday: uuid => {
            dispatch(tasksToSomeday([uuid]));
        },
        editTask: (uuid, update) => {
            dispatch(taskEdit({ uuid, update }));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);

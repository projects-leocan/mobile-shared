import React from 'react';
import I18n from 'react-native-i18n'
import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/FontAwesome';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import TakePhoto from 'rc-mobile-base/lib/components/TakePhoto';
import TakenPhoto from 'rc-mobile-base/lib/components/TakenPhoto';
import InlinePhoto from 'rc-mobile-base/lib/components/InlinePhoto';

import {
  ModalContainer,
  ModalContent,
  OptionsContainer,
  OptionsContent,
  OptionButton,
  OptionText,
  HandDeliveredContainer,
  HandDelieverdSignatureContainer,
  HandDelieverdSignatureContent,
  HandDelieverdSignatureImage,
  PhotosContainer,
  PhotosContent,
  HandDeliveredHeaderText,
  HandDeliveredSubheaderText,
  HandDeliveredResetButton,
  HandDeliveredOkayButton,
  HandDelieverdButtonText,
  NotesContainer,
  NotesInput
} from './styles';

import { updateOptions } from './utils';

const Option = ({ label, value, icon, handle, isActive }) => (
  <OptionButton isActive={isActive} onPress={() => handle(value)}>
    <Icon size={24} color="white" name={icon} />
    <OptionText>{ label }</OptionText>
  </OptionButton>
)

export default class Modal extends React.PureComponent {

  _handleSave = (result) => {
    this.props.handlePhoto('signaturePath', result.pathName);
  }

  _handleDrag = () => {
    // this.refs["sign"].saveImage();
  }

  _handleReset = () => {
    this.refs.sign && this.refs["sign"].resetImage();
    this.props.handlePhoto('signaturePath', null);
  }

  render() {
    const { status, notes, isHandDelivered, exit, handleUpdate, handleNotes, signaturePath } = this.props;

    return (
      <ModalContainer>
        <ModalHeader
          value={"Update status"}
          onPress={exit}
          />
    
        <ModalContent>
          { isHandDelivered ?
            <HandDeliveredContainer>
              <HandDelieverdSignatureContainer>
                <HandDeliveredHeaderText>{ I18n.t('base.lost-found-review.modal.guest-signature-optional') }</HandDeliveredHeaderText>

                { signaturePath ?
                  <HandDelieverdSignatureContent>
                    <HandDelieverdSignatureImage
                      source={{ uri: signaturePath }}
                      />

                    <HandDeliveredResetButton onPress={this._handleReset}>
                      <HandDelieverdButtonText>RESET</HandDelieverdButtonText>
                    </HandDeliveredResetButton>
                  </HandDelieverdSignatureContent>
                  :
                  <HandDelieverdSignatureContent>
                    <SignatureCapture
                      ref="sign"
                      style={[{ width: '100%', height: 400, backgroundColor: '#EDEDED', borderWidth: 0 }]}
                      onSaveEvent={this._handleSave}
                      onDragEvent={this._handleDrag}
                      saveImageFileInExtStorage={false}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      square={true}
                      viewMode={"landscape"}/>

                    <HandDeliveredResetButton onPress={this._handleReset}>
                      <HandDelieverdButtonText>RESET</HandDelieverdButtonText>
                    </HandDeliveredResetButton>

                    <HandDeliveredOkayButton onPress={() => this.refs["sign"].saveImage()}>
                      <HandDelieverdButtonText>OKAY</HandDelieverdButtonText>
                    </HandDeliveredOkayButton>
                  </HandDelieverdSignatureContent>  
                }
              </HandDelieverdSignatureContainer>
            </HandDeliveredContainer>
            :
            <OptionsContainer>
              { console.log(status) }
              <OptionsContent>
                { updateOptions.map(({ value, translation, icon }) =>
                  <Option
                    key={value}
                    value={value}
                    icon={icon}
                    label={I18n.t(translation)}
                    handle={handleUpdate}
                    isActive={status === value}
                    />
                )}

              </OptionsContent>
              
              <NotesContainer>
                <HandDeliveredHeaderText>{ I18n.t('base.lost-found-review.modal.notes-optional') }</HandDeliveredHeaderText>
                
                <NotesInput
                  multiline
                  onChangeText={handleNotes}
                  value={notes}
                  />
              </NotesContainer>
              
              <PhotosContainer>
                <HandDeliveredHeaderText>{ I18n.t('base.lost-found-review.modal.added-photos-optional') }</HandDeliveredHeaderText>
                
                <PhotosContent>
                  <InlinePhoto
                    style={{ marginRight: 10 }}
                    label="Photo 1"
                    onPhoto={(path) => this.props.handlePhoto('photoOnePath', path)}
                    />
                  <InlinePhoto
                    label="Photo 2"
                    onPhoto={(path) => this.props.handlePhoto('photoTwoPath', path)}
                    />
                </PhotosContent>
              </PhotosContainer>
            </OptionsContainer>
          }
        </ModalContent>
      </ModalContainer> 
    )
  }
}
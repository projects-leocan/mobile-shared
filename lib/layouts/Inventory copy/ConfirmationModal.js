import React from 'react';
import Modalbox from 'react-native-modalbox';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader'

import {
  ModalContainer,
  ModalSpacer,
  ModalContent,
  ModalRow,
  ModalRowImage,
  ModalRowTextContainer,
  ModalRowText,
  ModalRowChangeContainer,
  ModalRowChange,
  OptionsRow,
  OptionsButton,
  OptionsButtonText,
} from './styles'

const ModalItem = ({ image, name, change, isWithdrawal }) => (
  <ModalRow>
    <ModalRowImage
      source={{ uri: image }}
      />
    
    <ModalRowTextContainer>
      <ModalRowText>{ name }</ModalRowText>
    </ModalRowTextContainer>
    
    <ModalRowChangeContainer>
      <ModalRowChange isWithdrawal={isWithdrawal}>
        { isWithdrawal ? `+${Math.abs(change)}` : `-${Math.abs(change)}` }
      </ModalRowChange>
    </ModalRowChangeContainer>
  </ModalRow>  
)

export default ConfirmationModal = ({ isShown, items = [], onConfirm, onCancel }) => (
  <Modalbox
    isOpen={isShown}
    onClose={onCancel}
    style={{ width: 300, height: 440 }}
    >
    <ModalContainer>
      <ModalHeader
        value="Confirmation"
        onPress={onCancel}
        />

      <ModalContent>
        { items.map((data, index) => 
          <ModalItem
            key={index}
            { ...data }
            />
        )}
      </ModalContent>

      <OptionsRow>
        <OptionsButton onPress={onCancel} isConfirm={false}>
          <OptionsButtonText>Cancel</OptionsButtonText>
        </OptionsButton>

        <OptionsButton onPress={onConfirm} isConfirm={true}>
          <OptionsButtonText>Confirm</OptionsButtonText>
        </OptionsButton>
      </OptionsRow>
    </ModalContainer>
  </Modalbox>
)
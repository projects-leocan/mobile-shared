import React from 'react';

import {
    NameContainer,
    NameText,
} from './styles';

export default CleaningName = ({ roomPlanning = {} }) => {
    return (
        <NameContainer>
            <NameText style={{ paddingHorizontal: 8 }} numberOfLines={3} isSmall={roomPlanning.name && roomPlanning.name.length > 6}>
                {roomPlanning.name}
            </NameText>
        </NameContainer>
    )
}
import React from 'react';

import {
    NameContainer,
    NameText,
} from './styles';

export default CleaningName = ({ roomPlanning = {} }) => {
    return (
        <NameContainer>
            <NameText style={{ paddingHorizontal: 8 }} numberOfLines={3} isSmall={true}>
                {roomPlanning.name}
            </NameText>
        </NameContainer>
    )
}
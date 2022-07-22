import React from 'react';
import {
    HeaderContainer,
    HeaderText,
    HeaderSeparator
} from './styles';

export default class CellHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label } = this.props;
        return (
            <HeaderContainer>
                <HeaderText>{label}</HeaderText>
                <HeaderSeparator></HeaderSeparator>
            </HeaderContainer>
        )
    }
}
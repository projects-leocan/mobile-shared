import React from 'react';
import {
    ItemContainer,
    ItemLabel,
    ItemLabelDesc
} from './styles';

export default class CellHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label, value, customItem } = this.props;
        return (
            <ItemContainer>
                <ItemLabel>{label}</ItemLabel>
                {value ? <ItemLabelDesc>{value}</ItemLabelDesc> : null}
                {customItem ? customItem : null}
            </ItemContainer>
        )
    }
}
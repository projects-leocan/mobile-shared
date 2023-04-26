import React from 'react';
import I18n from 'react-native-i18n'
import Picture from 'rc-mobile-base/lib/components/Picture';

import ItemType from './ItemType';

import {
  ItemContainer,
  ItemImage,
  ItemImagePlaceholder,
  ItemDescription,
  ItemTypeContainer,
  ItemReference,
  ItemGuest,
  ItemLocation,
  ItemUser,
  ItemStatusContainer,
  ItemStatusButton,
  ItemStatusText,
  ImageContainer
} from './styles';

import { updateOptionsLookup } from './utils';
import { Image, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';
import { map, get, isEmpty } from "lodash"
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';

import {
  grey,
} from 'rc-mobile-base/lib/styles';

export default Item = ({ item, handleActive, onpressImageIcon, isShowImageViewer, setActiveImageId }) => (
  <ItemContainer>
    {/* <Picture
      size={60}
      value={item.image_urls}
      enableLightbox
    /> */}
    {isEmpty(item.image_urls) ?
      <ImageContainer>
        <Icon
          color={grey.color}
          name={'image'}
          size={45}
        />
      </ImageContainer>

      :
      <TouchableOpacity onPress={() => onpressImageIcon(item)}>
        <FastImage
          style={{
            width: 60,
            height: 60,
          }}
          source={{ uri: (item?.image_urls[0]) }}
        />
      </TouchableOpacity>
    }

    {!isEmpty(item.image_urls) && (
      <ImageViewer
        isVisible={isShowImageViewer && setActiveImageId === item.id}
        initialIndex={0}
        images={map(item?.image_urls, function (obj) { return { url: obj } })}
        toggleTaskImageModal={onpressImageIcon}
      />
    )}

    <ItemDescription>{item.name_or_description}</ItemDescription>
    <ItemTypeContainer>
      <ItemType label={I18n.t('base.lost-found-review.index.found')} isFound={true} />
    </ItemTypeContainer>
    <ItemReference>{item.reference}</ItemReference>
    <ItemGuest>{item.guest_name}</ItemGuest>
    <ItemLocation>{item.location || item.room_name}</ItemLocation>
    <ItemUser>{`${item.user_first_name} ${item.user_last_name}`}</ItemUser>
    <ItemStatusContainer>
      <ItemStatusButton onPress={() => handleActive(item)}>
        {/* <ItemStatusText>{item.status ? I18n.t(updateOptionsLookup(item.status)) : ""}</ItemStatusText> */}
        <ItemStatusText>{item.status ? item.status : ""}</ItemStatusText>
      </ItemStatusButton>
    </ItemStatusContainer>
  </ItemContainer>
)
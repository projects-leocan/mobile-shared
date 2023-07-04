import React from 'react';
import I18n from 'react-native-i18n'
import ItemType from 'rc-mobile-base/lib/layouts/LFReview/ItemType';
import { ItemContainer, ItemDescription, ItemTypeContainer, ItemReference, ItemLocation, ItemUser, ItemStatusContainer, ItemStatusButton, ItemStatusText, ImageContainer, RightView, CenterView, LeftView } from 'rc-mobile-base/lib/layouts/LFReview/style_M';
import { TouchableOpacity } from 'react-native';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';
import { map, get, isEmpty } from "lodash"
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';

import {
  grey,
} from 'rc-mobile-base/lib/styles';

const Item_M = ({ item, handleActive, onpressImageIcon, isShowImageViewer, setActiveImageId }) => (
  <ItemContainer>
    <LeftView>
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
    </LeftView>
    
    

    {!isEmpty(item.image_urls) && (
      <ImageViewer
        isVisible={isShowImageViewer && setActiveImageId === item.id}
        initialIndex={0}
        images={map(item?.image_urls, function (obj) { return { url: obj } })}
        toggleTaskImageModal={onpressImageIcon}
      />
    )}
    <CenterView>
    <ItemDescription>{item.name_or_description}</ItemDescription>
    <ItemLocation>{item.location || item.room_name}</ItemLocation>
    <ItemUser>{`${item.user_first_name} ${item.user_last_name}`}</ItemUser>

    <ItemTypeContainer>
      <ItemType label={I18n.t('base.lost-found-review.index.found')} isFound={true} />
    </ItemTypeContainer>
    </CenterView>
    
    <RightView>
    <ItemReference>{item.reference}</ItemReference>
    <ItemStatusContainer>
      <ItemStatusButton onPress={() => handleActive(item)}>
        <ItemStatusText>{item.status ? item.status : ""}</ItemStatusText>
      </ItemStatusButton>
    </ItemStatusContainer>
    </RightView>
   
  </ItemContainer>
)
export default Item_M


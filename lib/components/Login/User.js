import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Field, reduxForm } from 'redux-form';
// import ListView from 'rc-mobile-base/lib/components/ListView';

import {
  margin,
  padding,
  opacityWhite,
  blue300,
  transparent,
  jcc
} from '../../styles';

import TextField, { TextFieldWithRef } from '../TextField';

import styles from './styles';
import logo from './logo.png';
import UserSelect from './UserSelect';
import DisplayError from './DisplayError';

export class UserLogin extends Component {
  focusPassword = () => this.passwordInput.focus()

  render() {
    const { hotel, handleSubmit, submitUserLogin, hotelReset, error } = this.props;

    return (
      <View testID="userLogin" style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.hotelNameContainer}>
            <Image source={{ uri: hotel.image || "" }} style={styles.logoImage}/>
            <View style={styles.backButtonContainer}>
              <Icon.Button
                name="arrow-left"
                size={16}
                onPress={hotelReset}
                {...blue300.bg}
              >
                Hotel
              </Icon.Button>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              {hotel.name}
            </Text>
          </View>
          <View style={[padding.a10, jcc]}>
            <FlatList
              horizontal={true}
              data={hotel.users}
              renderItem={({ item: user, index }) => <Field testID={`user${index}`} name="username" user={user} component={UserSelect} focusPassword={this.focusPassword} />}
            />
          </View>
          {error && <DisplayError error={error} />}
          <View style={styles.inputs}>
            <View style={[styles.inputContainer, margin.b15]}>
              <Field
                testID="username"
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                selectTextOnFocus={false}
                name="username"
                style={styles.inputField}
                placeholder='Username'
                underlineColorAndroid={transparent.color}
                placeholderTextColor={opacityWhite.p60.color}
                component={TextField}
                onSubmitEditing={this.focusPassword}
              />
            </View>
            <View style={styles.inputContainer}>
              <Field
                testID="password"
                refName={(ref) => this.passwordInput = ref}
                name="password"
                autoCapitalize="none"
                returnKeyType="send"
                autoCorrect={false}
                secureTextEntry
                style={styles.inputField}
                component={TextFieldWithRef}
                placeholder='Password'
                underlineColorAndroid={transparent.color}
                placeholderTextColor={opacityWhite.p60.color}
                onSubmitEditing={handleSubmit(submitUserLogin)}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.btnContainer}>
          <TouchableOpacity testID="submitUserLogin" style={styles.continueBtn} onPress={handleSubmit(submitUserLogin)}>
            <Icon name="paper-plane" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default reduxForm({
  form: 'userLogin'
})(UserLogin)

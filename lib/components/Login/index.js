import React, { Component } from 'react';

import HotelLogin from './Hotel';
import UserLogin from './User';

export const Login = ({ isActiveHotel, ...others }) =>
  isActiveHotel ? <UserLogin {...others} /> : <HotelLogin {...others} />

export default Login

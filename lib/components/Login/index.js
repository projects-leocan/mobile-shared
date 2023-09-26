import React, { Component } from 'react';

import HotelLogin from './Hotel';
import UserLogin from './User';
import Permission from 'rc-mobile-base/lib/components/Login/Permission';

export const Login = ({ isDisplayLogin, isActiveHotel, ...others}) =>
  isActiveHotel ? isDisplayLogin ?  <UserLogin {...others} /> : <Permission {...others}/> : <HotelLogin {...others} />
  // isActiveHotel ? <Permission {...others} /> : <HotelLogin {...others} />


export default Login

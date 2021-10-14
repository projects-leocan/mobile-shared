import { times } from 'lodash/util';

const admin = "564ba794a6ef350b530000c3"
const yves = '55d06bb599295b3a5a000076'

const user = (userId, fullName, type) => ({
  type,
  city: "",
  country: "",
  email: "jweizman@roomchecking.com",
  first_name: "System",
  last_name : "System",
  groups: [],
  hotel : "55d06bb499295b3a5a000000",
  hotelUsername : "rcen",
  hotelUsernameRequired : false,
  isAdministrator : true,
  isAttendant : false,
  isBypassAttendant : false,
  isFoodBeverage : false,
  isHost : false,
  isInspector : false,
  isMaintenance : false,
  isReceptionist : false,
  isRoomRunner : false,
  isRoomsServices : false,
  language : "en",
  role : 5,
  state : "",
  status : "active",
  street : "",
  thumbnail : "",
  username : "vienna",
  zip : "",
  _id : userId,
  //computed
  fullName,
  // isSelected
})


export const room = (index) => ({
  _id: index + 1,
  roomStatus: {
    color: 'AAA',
    code: 'DEP'
  },
  name: (100 + index).toString(),
  floor: {
    number: index % 2 === 0 ? 1 : 2
  }
})

export const users = [
  user(admin, 'System System', 'quick'),
  user(yves, 'Yves Longperree', 'quick'),
]

export const rooms = times(10, (index) => room(index)).sort((a, b) => a.floor.number - b.floor.number)

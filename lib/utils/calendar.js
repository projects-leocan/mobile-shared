import { get } from 'lodash/object';
import { take, first, uniq, last } from 'lodash/array';
import { isEmpty } from 'lodash/lang';
import { includes } from 'lodash/collection';
import moment from 'moment';

let displayMap = {
	arrival: 'ARR',
	arrived: 'ARR',
	stay: 'STAY',
	departed: 'DEP',
	departure: 'DEP'
};

function sortCalendar(a, b) {
	let s = get(a, 'check_out_date');
	let e = get(b, 'check_out_date');

	if (!s) {
		return -1;
	}
	if (!e) {
		return 1;
	}

	return moment(e).unix() - moment(s).unix();
}

function momentizeDate(date) {
	if (!date) {
		return moment();
	}

	// return moment.utc(date).add(180, 'minute');
  return moment(take(date, 10).join(''));
}

function isMatchGuest(e1, e2) {
	if (!e2) {
		return false;
	}

	let first = get(e1, 'name');
	let second = get(e2, 'name');

	if (!first || !second) {
		return false;
	}

	if (get(e1, 'checkInDate') !== get(e2, 'checkInDate') || get(e1, 'checkOutDate') !== get(e2, 'checkOutDate')) {
		return false;
	}

	let isPartMatch = false;
	get(e1, 'name').split(' ').forEach(function (e1Part) {
		get(e2, 'name').split(' ').forEach(function (e2Part) {
			if (e1Part.toLowerCase() === e2Part.toLowerCase()) {
				isPartMatch = true;
			}
		});
	});

	return isPartMatch;
}

export function calculateGuest(entries) {
	if (!entries || isEmpty(entries)) {
		return null;
	}

	let today = moment(moment().format('YYYY-MM-DD'));

	entries = entries.reduce(function (pv, item) {
		function calculateScore(r) {
			let score = 0;

			score += moment(get(r, 'check_out_date')).unix();
			if (r.arrival_ts) {
				score += parseInt(get(r, 'arrival_ts'));
			}
			if (r.departure_ts) {
				score += parseInt(get(r, 'departure_ts'));
			}

			return score;
		}

		let guest = get(item, 'guest_name', '').trim().toLowerCase();
		// let seen_guest = pv.map(function (res) {
		// 	return get(res, 'guest_name', '').trim().toLowerCase();
		// });

		// if (seen_guest.indexOf(guest) !== -1) {
		// 	let comparisonIndex = seen_guest.indexOf(guest);
		// 	let pre = calculateScore(pv[comparisonIndex]);
		// 	let post = calculateScore(item);

		// 	if (post > pre) {
		// 		pv[comparisonIndex] = item;
		// 	}
		// } else {
		// 	pv.push(item);
    // }
    pv.push(item);

		return pv;
	}, []);

	let mapped = entries.sort(sortCalendar).map(function (entry) {
		let guestData = {
			name: get(entry, 'guest_name', '').replace(/ +/g, ' '),
			group: get(entry, 'group_name'),
      occupants: get(entry, 'occupants'),
      adults: get(entry, 'adults'),
      children: get(entry, 'children'),
      infants: get(entry, 'infants'),
			pmsId: get(entry, 'pms_id'),
			pmsNote: get(entry, 'pms_note'),
      rcNote: get(entry, 'rc_note'),
      eta: get(entry, 'expected_arrival_ts'),
      etd: get(entry, 'expected_departure_ts'),
			vip: get(entry, 'vip', null),
      email: get(entry, 'email', null),
      guest: get(entry, 'guest', {}),
			status: null,
			display: null,
			checkInDate: null,
			checkOutDate: null,
			isActive: false
		};

		let checkInDate = momentizeDate(get(entry, 'check_in_date'));
		let checkOutDate = momentizeDate(get(entry, 'check_out_date'));

		let isArrToday = checkInDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
		let isDepToday = checkOutDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');

		let isArrivalExist = get(entry, 'arrival_ts');
		let isDepartureExist = get(entry, 'departure_ts');

		guestData.checkInDate = checkInDate.format('YYYY-MM-DD');
		guestData.checkOutDate = checkOutDate.format('YYYY-MM-DD');

		guestData.status = 'stay';

		if (isArrToday) {
			if (isArrivalExist) {
				guestData.status = 'arrived';
			} else {
				guestData.status = 'arrival';
			}
		}
		
		if (isDepToday) {
			if (isDepartureExist) {
				guestData.status = 'departed';
			} else {
				guestData.status = 'departure';
			}
		}

		guestData.display = displayMap[guestData.status];
		return guestData;
	});

	return mapped.reduce(function (pv, item) {
		let lastPMS = pv.length && (get(pv[pv.length - 1], 'pmsId', '') || '').trim();
		let lastName = pv.length && (get(pv[pv.length - 1], 'name', '') || '').trim();

		let currentPMS = item && (get(item, 'pmsId', '') || '').trim();
		let currentName = item && (get(item, 'name', '') || '').trim();

		let last = lastName + ':' + lastPMS;
		let current = currentName + ':' + currentPMS;

    let isLastMatch = pv.length && isMatchGuest(item, pv[pv.length - 1]);
    // if (item.name.toLowerCase() === "MICHEL HADDAD".toLowerCase() && pv.length > 0) {
    //   debugger;
    // }

		if (current && last !== current && !isLastMatch) {
			pv.push(item);
		}

		return pv;
	}, []);
}

export function calculateGuestCode(roomCalendar, roomCalculation) {
	if (!roomCalendar || isEmpty(roomCalendar)) {
		return null;
	}

	if (!roomCalculation) {
		return null;
	}

	let f = first(roomCalculation);

	if (roomCalendar.length === 1) {
		let status = get(f, 'status');

		if (status === 'stay') {
			return 'stay';
		}
		if (status === 'departure' || status === 'departed') {
			return 'dep';
		}
		if (status === 'arrival' || 'arrived') {
			return 'arr';
		}

		return '';
	}

	let statuses = roomCalculation.map(function (entry) {
		let status = get(entry, 'status');

		if (status === 'stay') {
			return 'stay';
		}
		if (status === 'departure' || status === 'departed') {
			return 'dep';
		}
		if (status === 'arrival' || 'arrived') {
			return 'arr';
		}

		return '';
	});

	statuses = uniq(statuses);

	if (includes(statuses, 'stay')) {
		return 'stay';
	}
	if (includes(statuses, 'arr') && includes(statuses, 'dep')) {
		return 'da';
	}

	return last(statuses);
}

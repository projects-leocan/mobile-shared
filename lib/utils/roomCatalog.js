import request from 'rc-mobile-base/lib/utils/request';
const ROOM_CATALOGS_API = `/RoomCatalog/GetListOfRoomCatalogImages`;

export async function getCatalogData(payload) {
    const { token, hotel_group_key, baseUrl, roomId } = payload;

    const headers = {
        Authorization: `Bearer ${token}`,
        hotel_group_key: hotel_group_key,
        'Content-Type': 'application/json'
    };

    const url = `${baseUrl}${ROOM_CATALOGS_API}`
    const options = {
        method: 'POST',
        body: JSON.stringify({
            roomId: roomId
        })
    }

    const catalogList = await request(url, {
        ...options,
        headers,
    });

    return catalogList;
}
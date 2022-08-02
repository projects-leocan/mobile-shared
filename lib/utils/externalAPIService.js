import request from 'rc-mobile-base/lib/utils/request';
const ROOM_CATALOGS_API = `/RoomCatalog/GetListOfRoomCatalogImages`;
const ROOM_INVENTORY_API = `/AssetSet/GetListOfSetsWithAssets`;

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

export async function getInventorySetAndAssets(payload) {
    const { token, hotel_group_key, baseUrl, roomId, hotelId } = payload;

    const headers = {
        Authorization: `Bearer ${token}`,
        hotel_group_key: hotel_group_key,
        'Content-Type': 'application/json'
    };

    const url = `${baseUrl}${ROOM_INVENTORY_API}`
    const options = {
        method: 'POST',
        body: JSON.stringify({
            hotelId: hotelId,
            roomId: roomId
        })
    }

    const response = await request(url, {
        ...options,
        headers,
    });

    return response;
}
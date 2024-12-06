const wpkKeyTypeMap = {
    wpk_my_id: 'string',
    wpk_my_name: 'string',
    wpk_access_token: 'string',
    wpk_expired_time: 'number'
};

export function setLocalStorageItem(key, item) {
    if (typeof item === 'object' && item !== null) {
        localStorage.setItem(key, JSON.stringify(item));
    } else {
        localStorage.setItem(key, item);
    }
}

export function getLocalStorageItem(key) {
    const item = localStorage.getItem(key);
    if (!item || item === 'null') return null;

    switch (wpkKeyTypeMap[key]) {
        case 'string':
            return item;
        case 'number':
            return Number(item);
        default:
            try {
                return JSON.parse(item);
            } catch (error) {
                return item;
            }
    }
}

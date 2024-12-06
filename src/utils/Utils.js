export function formatDate(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getGMTInfo() {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(offset / 60);
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function decodeJWTPayload(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }
    const payload = parts[1];
    return base64UrlDecode(payload);
}

const base64UrlDecode = (str) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4) {
        // Add base64 padding
        base64 += '=';
    }
    const decodedStr = atob(base64);
    return JSON.parse(decodedStr);
};

export function decodeJWT(token: string) {
    const [header, payload, signature] = token.split('.');

    if (!payload) {
        throw new Error("Invalid token format");
    }

    // Decode Base64Url (header and payload are Base64Url-encoded)
    const decodeBase64Url = (base64Url: string) => {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = atob(base64); // atob() decodes a base64 string
        return JSON.parse(decodedData);
    };

    const decodedHeader = decodeBase64Url(header);
    const decodedPayload = decodeBase64Url(payload);

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: signature
    };
}
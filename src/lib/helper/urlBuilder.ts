/**
 * Converts an object to a URL query string safely.
 * 
 * @param obj - The object to convert.
 * @returns A URL-encoded query string.
 */
export function urlBuilder(obj: Record<string, any>): string {
    try {
        if (!obj || typeof obj !== 'object') {
            throw new Error('Invalid input: expected an object');
        }

        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null) // Filter out undefined and null values
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(String(obj[key]))) // Ensure values are strings
            .join('&');
    } catch (error) {

        return ""

    }
}
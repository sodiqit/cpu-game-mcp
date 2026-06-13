/** Pull a human message out of an API error body (`{ message }` / `{ message: string[] }`). */
export function describeApiError(data: unknown): string {
    if (data !== null && typeof data === 'object' && 'message' in data) {
        const message = (data as { message: unknown }).message;
        return Array.isArray(message) ? message.map(String).join('; ') : String(message);
    }
    return JSON.stringify(data);
}

export const safeSetItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value)
    } catch (e) {
        console.warn('Failed to save to localStorage:', e)
    }
}

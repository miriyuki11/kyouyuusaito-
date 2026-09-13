export function getStoredJson<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;

	try {
		const value = window.localStorage.getItem(key);
		return value ? JSON.parse(value) as T : fallback;
	} catch {
		return fallback;
	}
}

export function setStoredJson<T>(key: string, value: T) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredValue(key: string, fallback = "") {
	if (typeof window === "undefined") return fallback;
	return window.localStorage.getItem(key) || fallback;
}

export function setStoredValue(key: string, value: string) {
	window.localStorage.setItem(key, value);
}
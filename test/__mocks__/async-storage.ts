export type Key = string;

const store = new Map<Key, string>();

const AsyncStorage = {
	getItem: async (key: Key): Promise<string | null> => (store.has(key) ? store.get(key)! : null),
	setItem: async (key: Key, value: string): Promise<void> => {
		store.set(key, value);
	},
	removeItem: async (key: Key): Promise<void> => {
		store.delete(key);
	},
	clear: async (): Promise<void> => {
		store.clear();
	},
};

export default AsyncStorage;



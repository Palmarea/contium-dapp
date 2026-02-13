import { get } from "svelte/store";
import { lang } from "./lang";
import { translations } from "./translations";

export function t(key) {
	const l = get(lang);
	return translations[l]?.[key] ?? translations.es[key] ?? key;
}

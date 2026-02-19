import { derived } from "svelte/store";
import { lang } from "./lang";
import { translations } from "./translations";

export const t = derived(
	lang,
	($lang) => (key) => translations[$lang]?.[key] ?? translations.es[key] ?? key
);

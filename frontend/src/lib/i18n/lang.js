import { writable } from "svelte/store";

const saved =
	typeof localStorage !== "undefined"
		? localStorage.getItem("lang")
		: null;

export const lang = writable(saved || "es");

lang.subscribe((v) => {
	if (typeof localStorage !== "undefined") {
		localStorage.setItem("lang", v);
	}
});

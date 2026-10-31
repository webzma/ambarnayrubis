/**
 * Runs in <head> before the first paint: applies the saved theme, otherwise the OS preference.
 * Plain module (not 'use client') so the root layout gets the string itself.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`

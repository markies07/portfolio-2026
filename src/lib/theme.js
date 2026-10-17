// Shared by the server layout and the client toggle, so it can't live in a
// "use client" module (server components only see references to those).

export const THEME_STORAGE_KEY = "theme";

// Runs before first paint (see layout). Dark is the default; a visitor who
// picked light gets <html data-theme="light"> before anything renders, so
// the page never flashes dark first.
export const THEME_SCRIPT = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

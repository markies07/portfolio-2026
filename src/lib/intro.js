// Shared by the server layout and the client intro, so it can't live in a
// "use client" module (server components only see references to those).

// Runs before first paint (see layout). The intro plays on every load of the
// home page, including refreshes (project pages open straight away);
// reduced-motion visitors and other pages get <html data-intro="skip">
// so CSS hides the terminal before it can flash. When it does play, the
// browser's scroll restoration is turned off so a refresh starts at the top,
// where the hero's entrance animations can actually be seen.
export const INTRO_GATE_SCRIPT = `try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||location.pathname!=="/")d.dataset.intro="skip";else if(!location.hash)history.scrollRestoration="manual"}catch(e){document.documentElement.dataset.intro="skip"}`;

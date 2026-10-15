// Centralized motion values so timing/easing stays consistent across the site.

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.22, 1, 0.36, 1];

export const DURATION = {
  micro: 0.25,
  medium: 0.55,
  large: 0.9,
  cinematic: 1.2,
};

// Hero entrance, in seconds after the intro hands off. Strict order:
//   1. portrait fades in — it must be fully opaque before the name rises
//      behind it, or the letters would show through it
//   2. the name, the moment the portrait is solid, with nothing else moving
//   3. everything else (labels, intro copy, scroll cue, bottom nav) once the
//      name has landed
export const heroTimeline = {
  image: 0.05,
  imageFade: 0.45, // portrait reaches full opacity at image + imageFade
  imageRise: 1.1, // the portrait's upward settle (it's already opaque)
  name: 0.5, // = image + imageFade
  nameRise: 0.6, // per word
  nameStagger: 0.05,
  details: 0.95, // name is visually settled by here
  detailFade: 0.5,
};

export const revealTransition = (delay = 0, duration = DURATION.large) => ({
  duration,
  delay,
  ease: EASE_OUT,
});

// Centralized motion values so timing/easing stays consistent across the site.

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.22, 1, 0.36, 1];

export const DURATION = {
  micro: 0.25,
  medium: 0.55,
  large: 0.9,
  cinematic: 1.2,
};

export const heroTimeline = {
  label: 0.2,
  headline: 0.35,
  name: 0.55,
  image: 0.75,
  supporting: 0.9,
};

export const revealTransition = (delay = 0, duration = DURATION.large) => ({
  duration,
  delay,
  ease: EASE_OUT,
});

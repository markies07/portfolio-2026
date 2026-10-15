"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Outside a provider everything counts as already revealed
const IntroContext = createContext({ done: true, finish: () => {} });

export function IntroProvider({ children }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Mount-only read of the attribute the gate script set before hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (document.documentElement.dataset.intro === "skip") setDone(true);
  }, []);

  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    setDone(true);
  }, []);

  const value = useMemo(() => ({ done, finish }), [done, finish]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

/** True once the site may start its entrance animations. */
export function useIntroDone() {
  return useContext(IntroContext).done;
}

export function useIntro() {
  return useContext(IntroContext);
}

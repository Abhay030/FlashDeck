"use client";

import { useEffect } from "react";

const TAB_TITLE = "FlashDeck";

export function TabTitleGuard() {
  useEffect(() => {
    const setStableTitle = () => {
      if (document.title !== TAB_TITLE) {
        document.title = TAB_TITLE;
      }
    };

    setStableTitle();
    document.addEventListener("visibilitychange", setStableTitle);
    window.addEventListener("focus", setStableTitle);
    window.addEventListener("blur", setStableTitle);

    return () => {
      document.removeEventListener("visibilitychange", setStableTitle);
      window.removeEventListener("focus", setStableTitle);
      window.removeEventListener("blur", setStableTitle);
    };
  }, []);

  return null;
}

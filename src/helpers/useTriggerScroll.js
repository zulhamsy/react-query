import React, { useEffect } from "react";

export default function useTriggerScroll(callback = () => {}) {
  useEffect(() => {
    function isScrolling() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;

      callback();
    }

    window.addEventListener("scroll", isScrolling);
    // cleanup
    return () => {
      window.removeEventListener("scroll", isScrolling);
    };
  }, []);
}

import { useEffect } from "react";

function useWindowFocusEffect(callback) {
  useEffect(() => {
    const handleFocus = () => callback("focus");
    const handleBlur = () => callback("blur");

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [callback]);
}

export default useWindowFocusEffect;

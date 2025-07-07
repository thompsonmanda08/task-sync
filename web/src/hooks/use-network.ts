import { useEffect, useState } from "react";

export const useNetwork = () => {
  const [online, setOnline] = useState(true);
  const [goneOffline, setGoneOffLine] = useState(0);

  useEffect(() => {
    const handleStatusChange = () => {
      setOnline(window.navigator.onLine);

      if (online) {
        setGoneOffLine(0);
      } else {
        setGoneOffLine(1);
      }
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [online]);
  return { online, goneOffline };
};

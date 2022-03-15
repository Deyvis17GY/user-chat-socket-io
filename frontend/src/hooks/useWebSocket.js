import { useEffect, useRef } from 'react';

const URI_WS = import.meta.env.VITE_WS_URL;
export const useWebSocket = () => {
  const URL = URI_WS ? URI_WS : 'wss://backend-ws-d.herokuapp.com/api';
  const ws = useRef(null);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(URL);
    }
    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    return () => {
      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        ws.current = new WebSocket(URL);
      };
    };
  }, [ws]);

  return { ws };
};

// src/shared/lib/websocket/WebSocketProvider.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../features/auth/store/auth.store';
import { roomService } from '../../../features/room/services/room.service'; // Ensure this import exists
import { toast } from '../../../shared/components/ui/toast';
import config from '../../config';
import { AxiosError } from 'axios';

const PING_INTERVAL = 8000; 

interface WebSocketContextType {}
const WebSocketContext = createContext<WebSocketContextType | null>(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    const connect = () => { // Removed async from here, as it's handled in onopen
      if (!isAuthenticated || !token || !userId || ws.current) return;
      
      const wsUrl = `${config.wsUrl}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = async () => {
        console.log('WebSocket Connected');
        
        try {
          // STEP 1: Fetch all user rooms
          console.log('Attempting to fetch rooms for subscription...');
          const rooms = await roomService.getRooms();
          const roomChannels = rooms.map(room => `room:${room.id}`);
          
          // STEP 2: Construct the full channel list
          const allChannels = [`user:${userId}`, ...roomChannels];

          // STEP 3: Subscribe to all channels
          const subscribeMessage = {
            type: 'SUBSCRIBE',
            payload: { channels: allChannels },
          };

          console.log('Subscription message prepared. Sending to server...', subscribeMessage);
          ws.current?.send(JSON.stringify(subscribeMessage));
          console.log('Successfully subscribed to channels:', allChannels);

          // Start sending pings to keep the connection alive
          pingInterval.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
              ws.current.send(JSON.stringify({ type: 'PING' }));
            }
          }, PING_INTERVAL);

        } catch (error) {
          // ** IMPROVED ERROR LOGGING **
          // This will now tell you exactly why the subscription failed.
          console.error('CRITICAL: Failed to subscribe to WebSocket channels.', error);
          if (error instanceof AxiosError) {
            console.error('Axios error details:', error.response?.data);
            toast.error(`Subscription failed: ${error.response?.data?.error?.message || 'Could not fetch rooms.'}`);
          } else {
            toast.error('An unknown error occurred during subscription.');
          }
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message); 
          switch (message.type) {
            case 'PROFILE_UPDATED':
              if (message.payload.new_image_url) {
                const cacheBustedUrl = `${message.payload.new_image_url}?v=${new Date().getTime()}`;
                useAuthStore.getState().updateUserProfile({ image_url: cacheBustedUrl });
                toast.success('Profile picture updated!');
              }
              break;
            case 'ERROR':
              toast.error(message.payload?.message || 'An unknown error occurred.');
              break;
          }
        } catch (error) {
          console.error('Failed to parse websocket message', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        if (pingInterval.current) clearInterval(pingInterval.current);
        ws.current = null;
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket Error:', event);
        if (pingInterval.current) clearInterval(pingInterval.current);
      };
    };

    const disconnect = () => {
      if (pingInterval.current) clearInterval(pingInterval.current);
      if (ws.current) {
        console.log('Closing WebSocket connection due to component unmount or state change.');
        ws.current.close();
        ws.current = null;
      }
    };
    
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }


    return () => disconnect();
  }, [isAuthenticated, token, userId]);

  return <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>;
};
import { useEffect, useRef } from 'react';
import { usePeopleStore } from '../stores/usePeopleStore';

interface usePeopleSocketProps {
  url: string;
  isActive?: boolean;
}

export const usePeopleSocket = ({ url, isActive = false }: usePeopleSocketProps) => {
  // Establish WebSocket connection
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Establish WebSocket connection
    socketRef.current = new WebSocket(url);

    // Handle WebSocket open, message, error, and close events here
    socketRef.current.onopen = () => {
      /* handle open */
      if (socketRef.current == null) return;
      console.log('Sending message');
      socketRef.current.send(JSON.stringify({ message: 'testing' }));
    };
    socketRef.current.onmessage = e => {
      /* handle incoming messages */
      const wsData = JSON.parse(e.data);
      console.log(wsData);
    };
    socketRef.current.onerror = error => {
      /* handle error */
    };
    socketRef.current.onclose = () => {
      /* handle close */
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, isActive]);

  useEffect(() => {
    if (!isActive || socketRef.current == null) return;

    const socket = socketRef.current;

    // Subscribe to changes in the store
    const unsubscribeData = usePeopleStore.subscribe(
      state => state.data,
      data => {
        // Send message when data changes
        //socket.send(JSON.stringify({ type: 'updateData', data }));
        console.log('Data changed, sending message');
        socket.send(JSON.stringify({ message: 'testing' }));
      },
    );

    const unsubscribeDefinitions = usePeopleStore.subscribe(
      state => state.propertyDefinitions,
      definitions => {
        // Send message when definitions change
        //socket.send(JSON.stringify({ type: 'updateDefinitions', definitions }));
        console.log('Definitions changed, sending message');
        socket.send(JSON.stringify({ message: 'testing' }));
      },
    );

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribeData();
      unsubscribeDefinitions();
    };
  }, [isActive]);
};

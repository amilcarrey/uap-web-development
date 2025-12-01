import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeNotification } from "../store/uiSlice";
import { useCallback, useEffect, useRef } from "react";

export function Notifications() {
    const notifications = useAppSelector(state => state.ui.notifications);
    const dispatch = useAppDispatch();

    // console.log("Notifications effect triggered", notifications);

    const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    // const processedIdsRef = useRef<Set<string>>(new Set());

    const handleRemoveNotification = useCallback((id: string) => {
      // console.log(`Removing notification: ${id}`);

      if (timeoutsRef.current[id]) {
        // console.log(`Clearing timeout for notification: ${id}`);
        clearTimeout(timeoutsRef.current[id]);
        delete timeoutsRef.current[id];
      }

      dispatch(removeNotification(id));
    }, [dispatch]);
    

    useEffect(() => {
        
        // console.log("Current notifications:", notifications);
        // console.log("Current timeouts:", Object.keys(timeoutsRef.current));
        // console.log("Processed IDs:", Array.from(processedIdsRef.current));

        notifications.forEach(notification => {
          // console.log(`Processing notification: ${notification.id} - ${notification.message}`);

            // console.log(`Adding notification ID to processed: ${notification.id}`);
            // processedIdsRef.current.add(notification.id);

          if (!timeoutsRef.current[notification.id]) {
            timeoutsRef.current[notification.id] = setTimeout(() => {
              // console.log(`Timeout completed for notification: ${notification.id} - ${notification.message}`);
              handleRemoveNotification(notification.id);

              // clearTimeout(timeoutsRef.current[notification.id]);
              // delete timeoutsRef.current[notification.id];

            }, notification.duration || 3000);
          }
          });

          Object.keys(timeoutsRef.current).forEach(id => {
            if (!notifications.some(n => n.id === id)) {
              clearTimeout(timeoutsRef.current[id]);
              delete timeoutsRef.current[id];
            }
          });
          
        

        // processedIdsRef.current.forEach(id => {
        //   if (!notifications.some(n => n.id === id)) {
        //     console.log(`Removing processed ID: ${id} as it's no longer in notifications`);
        //     processedIdsRef.current.delete(id);
        //     // handleRemoveNotification(id);
        //   }
        // })

          // return () => {
          //   Object.values(timeoutsRef.current).forEach(clearTimeout);
          // }
        
        }, [notifications, handleRemoveNotification]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-3 rounded shadow-md ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white`}
        >
          {notification.message}
          <button
            className="ml-2 text-white"
            onClick={() => {
              // Limpiar el timeout cuando se cierra manualmente
                if (timeoutsRef.current[notification.id]) {
                clearTimeout(timeoutsRef.current[notification.id]);
                  delete timeoutsRef.current[notification.id];
                }
                dispatch(removeNotification(notification.id));                            
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
    )


}

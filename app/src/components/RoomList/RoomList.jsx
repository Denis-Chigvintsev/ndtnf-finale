import { debounceTime, from, switchMap, fromEvent } from 'rxjs';
//import s from './RoomList.module.css';
import { useEffect } from 'react';

let rooms$;

function RoomList() {
  useEffect(() => {
    rooms$ = fromEvent(document.getElementById('roomsListAll'), 'click').pipe(
      debounceTime(300),
      switchMap(() => {
        return fetch('http://localhost/hotel-rooms', {
          credentials: 'include',
        })
          .then((res) => res.json())

          .catch((error) => console.log(error));
      })
    );

    rooms$.subscribe((data) => console.log(data));

    return () => {
      if (rooms$) {
        rooms$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <button id='roomsListAll'>
        <h3>Вывод полного списка номеров// ANYBODY </h3>
      </button>
    </div>
  );
}
export default RoomList;

import { debounceTime, from, switchMap, fromEvent, map, mergeMap } from 'rxjs';

import { useEffect } from 'react';

import s from './GetOneRoom.module.css';
let roomID, roomID$;

function GetOneRoom() {
  function handleFormSubmit(e) {
    e.preventDefault();
    e.target.room_ga.value = '';

    from([roomID])
      .pipe(
        mergeMap((data) => {
          return fetch(`http://localhost/hotel-rooms/${roomID}`)
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe(console.log);
  }

  useEffect(() => {
    const roomID_ = document.getElementById('room_ga');
    roomID$ = fromEvent(roomID_, 'change', 'keyup')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        roomID = data;
      });

    return () => {
      if (roomID$) {
        roomID$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Вывести информацию о конкретном номере// ANYBODY </h3>

      <form onSubmit={handleFormSubmit}>
        <label>
          id номера
          <input id='room_ga' type='text' />
        </label>
        <br />

        <button type='submit'>Вывести информацию о номере</button>
      </form>
    </div>
  );
}
export default GetOneRoom;

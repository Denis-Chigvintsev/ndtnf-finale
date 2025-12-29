import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap } from 'rxjs';

import s from './CreateReservationClient.module.css';

let roomId;
let dateStart;
let dateEnd;

function CreateReservationClient() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const reservation = {
      roomId: roomId,
      dateStart: dateStart,
      dateEnd: dateEnd,
    };

    e.target.roomId_crc.value = '';
    e.target.dateStart_crc.value = '';
    e.target.dateEnd_crc.value = '';

    from(JSON.stringify(reservation))
      .pipe(
        exhaustMap((data) => {
          return fetch('http://localhost/reservations/client', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(reservation),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const roomId_ = document.getElementById('roomId_crc');
    const roomId$ = fromEvent(roomId_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        roomId = data;
      });

    const dateStart_ = document.getElementById('dateStart_crc');
    const dateStart$ = fromEvent(dateStart_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        dateStart = new Date(Date.parse(data));
      });

    const dateEnd_ = document.getElementById('dateEnd_crc');
    const dateEnd$ = fromEvent(dateEnd_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        dateEnd = new Date(Date.parse(data));
      });

    return () => {
      if (roomId$) {
        roomId$.unsubscribe();
      }
      if (dateStart$) {
        dateStart$.unsubscribe();
      }
      if (dateEnd$) {
        dateStart$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Резервирование номера / Client</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          id номера:
          <input type='text' id='roomId_crc' />
        </label>
        <br />
        <label>
          Дата приезда:
          <input type='date' id='dateStart_crc' />
        </label>
        <br />
        <label>
          Дата отъезда:
          <input type='date' id='dateEnd_crc' />
        </label>
        <br />

        <button type='submit'>Зарезервировать</button>
      </form>
    </div>
  );
}

export default CreateReservationClient;

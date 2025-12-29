import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap, take } from 'rxjs';
import s from './RoomEdit.module.css';

let hotelId;
let description;
let images = [];
let room1;
let roomID;

function RoomEdit() {
  function handleFormSubmit(e) {
    const data1 = new FormData();

    e.preventDefault();

    room1 = {
      hotel: hotelId,
      description: description,
    };

    data1.append('file', images[0]);

    e.target.hotelId_re.value = '';
    e.target.description_re.value = '';
    e.target.file_re.value = '';
    e.target.id_re.value = '';

    from(data1)
      .pipe(
        debounceTime(300),
        exhaustMap(async (data) => {
          await fetch(`http://localhost/files/upload`, {
            method: 'POST',
            credentials: 'include',
            body: data1,
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(1000, json);
              images[0] = json.filename;
              room1.images = images[0];
            })
            .catch((error) => {
              console.log(error);
            });
        }),

        exhaustMap((data) => {
          return fetch(`http://localhost/hotel-rooms/admin/${roomID}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(room1),
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(1000, json);
            })
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const roomID_ = document.getElementById('id_re');
    const roomID$ = fromEvent(roomID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        roomID = data;
      });

    const hotel_ = document.getElementById('hotelId_re');
    const hotel$ = fromEvent(hotel_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        hotelId = data;
      });

    const description_ = document.getElementById('description_re');
    const description$ = fromEvent(description_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        description = data;
      });

    const file_ = document.getElementById('file_re');
    const file1$ = fromEvent(file_, 'change')
      .pipe(map((e) => e.target.files?.[0]))
      .subscribe((data) => {
        images[0] = data;
      });

    return () => {
      if (file1$) {
        file1$.unsubscribe();
      }
      if (description$) {
        description$.unsubscribe();
      }
      if (hotel$) {
        hotel$.unsubscribe();
      }

      if (roomID$) {
        roomID$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Изменение данных номера // ADMIN</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          Id номера:
          <input id='id_re' type='text' />
        </label>
        <br />
        <label>
          Id Гостиницы:
          <input id='hotelId_re' type='text' />
        </label>
        <br />
        <label>
          Описание:
          <input type='text' id='description_re' />
        </label>
        <br />
        <label>
          фотография:
          <input type='file' id='file_re' required />
        </label>
        <br />

        <button type='submit'>Подтвердить изменение</button>
      </form>
    </div>
  );
}
export default RoomEdit;

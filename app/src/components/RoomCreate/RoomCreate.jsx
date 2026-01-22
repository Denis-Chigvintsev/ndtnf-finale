import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap, take } from 'rxjs';
import s from './RoomCreate.module.css';

let hotelId;
let description;
let images = [];
let room1;
let flag;
let isEnabled;

function RoomCreate() {
  function handleFormSubmit(e) {
    const data1 = new FormData();
    let base$;
    e.preventDefault();

    if (flag == '1') isEnabled = true;
    if (flag == '2') isEnabled = false;

    room1 = {
      hotelId: hotelId,
      description: description,
      isEnabled: isEnabled,
    };

    data1.append('file', images[0]);

    e.target.hotelId_cr.value = '';
    e.target.description_cr.value = '';
    e.target.file_cr.value = '';

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
              //console.log(json);
              images[0] = json.filename;
              room1.images = images[0];
            })
            .catch((error) => {
              console.log(error);
            });
        }),
        map(() => {}),
        exhaustMap((data) => {
          return fetch('http://localhost/api/admin/hotel-rooms', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(room1),
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
            })
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const hotel_ = document.getElementById('hotelId_cr');
    const hotel$ = fromEvent(hotel_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        hotelId = data;
      });

    const description_ = document.getElementById('description_cr');
    const description$ = fromEvent(description_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        description = data;
      });

    const file_ = document.getElementById('file_cr');
    const file1$ = fromEvent(file_, 'change')
      .pipe(map((e) => e.target.files?.[0]))
      .subscribe((data) => {
        images[0] = data;
      });

    const flag_ = document.getElementById('flag_cr');
    const flag$ = fromEvent(flag_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        flag = data;
        console.log(flag);
      });

    return () => {
      if (flag$) {
        flag$.unsubscribe();
      }
      if (file1$) {
        file1$.unsubscribe();
      }
      if (description$) {
        description$.unsubscribe();
      }
      if (hotel$) {
        hotel$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Ввести описание номера // ADMIN</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          Id гостиницы:
          <input id='hotelId_cr' type='text' />
        </label>
        <br />
        <label>
          Описание:
          <input type='text' id='description_cr' />
        </label>
        <br />
        <label>
          фотография:
          <input type='file' id='file_cr' required />
        </label>
        <br />
        <label>
          Вкл/Выкл:
          <select id='flag_cr' required>
            <option value='0'> Не использовать опцию</option>
            <option value='1'> Подключить комнату</option>
            <option value='2'> Отключить комнату </option>
          </select>
        </label>
        <br />
        <button type='submit'>Записать</button>
      </form>
    </div>
  );
}

export default RoomCreate;

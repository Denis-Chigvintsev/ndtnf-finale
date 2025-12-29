import { useEffect } from 'react';
import {
  debounceTime,
  fromEvent,
  map,
  from,
  switchMap,
  take,
  exhaustMap,
  EMPTY,
} from 'rxjs';

import s from './UpdateHotel.css';

let id1;
let title;
let description;

function UpdateHotel() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const hotel_upd = {
      title: title,
      description: description,
    };

    e.target.id_upH.value = '';
    e.target.title_upH.value = '';
    e.target.description_upH.value = '';

    from(JSON.stringify(hotel_upd))
      .pipe(
        debounceTime(300),
        switchMap(async (data) => {
          await fetch(`http://localhost/hotels/admin/${await id1}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(hotel_upd),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const id1_ = document.getElementById('id_upH');
    const id1$ = fromEvent(id1_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        id1 = data;
      });

    const title_ = document.getElementById('title_upH');
    const title$ = fromEvent(title_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        title = data;
      });

    const description_ = document.getElementById('description_upH');
    const description$ = fromEvent(description_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        description = data;
      });

    return () => {
      if (id1$) {
        id1$.unsubscribe();
      }
      if (title$) {
        title$.unsubscribe();
      }
      if (description$) {
        description$.unsubscribe();
      }
    };
  }, []);
  return (
    <div>
      <br />
      <h3>Внесение изменений в информацию о гостинице / Admin</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          id гостиницы:
          <input id='id_upH' type='text' />
        </label>
        <br />
        <label>
          Название гостиницы:
          <input id='title_upH' type='text' />
        </label>
        <br />
        <label>
          Описание гостиницы:
          <input type='text' id='description_upH' />
        </label>
        <br />

        <button type='submit'>Изменить</button>
      </form>
    </div>
  );
}

export default UpdateHotel;

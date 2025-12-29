import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap, take } from 'rxjs';

import s from './AddNewHotel.css';

let title;
let description;

function AddNewHotel() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const hotel = {
      title: title,
      description: description,
    };

    e.target.title.value = '';
    e.target.description.value = '';

    from(JSON.stringify(hotel))
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          return fetch('http://localhost/hotels/admin', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(hotel),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe(console.log);
  }

  useEffect(() => {
    const title_ = document.getElementById('title');
    const title$ = fromEvent(title_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        title = data;
      });

    const description_ = document.getElementById('description');
    const description$ = fromEvent(description_, 'change')
      .pipe(
        debounceTime(300),
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        description = data;
      });

    return () => {
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
      <h3>Ввод новой гостиницы / Admin</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          Название гостиницы:
          <input id='title' type='text' />
        </label>
        <br />
        <label>
          Описание гостиницы:
          <input type='text' id='description' />
        </label>
        <br />

        <button type='submit'>Записать</button>
      </form>
    </div>
  );
}

export default AddNewHotel;

import s from './SupportRequestCreation.module.css';
import { debounceTime, fromEvent, map, from, switchMap } from 'rxjs';
import { useEffect } from 'react';
let text = '';

function SupportRequestCreation() {
  function handleFormSubmit(e) {
    e.preventDefault();
    const createSupportDto = { text: text };
    e.target.text_src.value = '';

    from(JSON.stringify(createSupportDto))
      .pipe(
        debounceTime(300),
        switchMap((data) => {
          return fetch('http://localhost/support/support-request/client', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(createSupportDto),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const text_ = document.getElementById('text_src');
    const text$ = fromEvent(text_, 'change', 'keyup')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        text = data;
      });

    return () => {
      if (text$) {
        text$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Создание обращения в тех поддержку // Client</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          Текст обращения:
          <input id='text_src' type='text' />
        </label>
        <br />
        <button type='submit'>Записать</button>
      </form>
    </div>
  );
}

export default SupportRequestCreation;

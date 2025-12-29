import { debounceTime, from, switchMap, fromEvent, take } from 'rxjs';
import s from './Form1.module.css';
import { useEffect } from 'react';

let hotels$;

function Form1() {
  useEffect(() => {
    hotels$ = fromEvent(document.getElementById('hotelList'), 'click').pipe(
      debounceTime(300),
      switchMap(() => {
        return fetch('http://localhost/hotels/admin', {
          credentials: 'include',
        })
          .then((res) => res.json())

          .catch((error) => console.log(error));
      })
    );

    hotels$.subscribe((data) => console.log(data));

    return () => {
      if (hotels$) {
        hotels$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <button id='hotelList'>
        <h3>Вывод полного списка гостиниц// ADMIN </h3>
      </button>
    </div>
  );
}
export default Form1;

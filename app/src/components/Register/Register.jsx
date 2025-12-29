import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap } from 'rxjs';

let email;
let password;
let name1;
let contactPhone;

//import s from './Register.module.css';

function Register() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const register = {
      email: email,
      password: password,
      name: name1,
      contactPhone: contactPhone,
    };

    e.target.email.value = '';
    e.target.password.value = '';
    e.target.name1.value = '';
    e.target.contactPhone.value = '';

    from(JSON.stringify(register))
      .pipe(
        exhaustMap((data) => {
          return fetch('http://localhost/authentication/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(register),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const email_ = document.getElementById('email');
    const email$ = fromEvent(email_, 'keyup', 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        email = data;
      });

    const password_ = document.getElementById('password');
    const pss$ = fromEvent(password_, 'keyup', 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        password = data;
      });

    const name1_ = document.getElementById('name1');
    const name1$ = fromEvent(name1_, 'keyup', 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        name1 = data;
      });

    const contactPhone_ = document.getElementById('contactPhone');
    const contactPhone$ = fromEvent(contactPhone_, 'keyup', 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        contactPhone = data;
      });
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <br />
      <h3>Регистрация пользователя типа "Client" </h3>
      <br />
      <label>
        Электронная почта:
        <input id='email' type='text' />
      </label>
      <br />
      <label>
        Пароль:
        <input type='text' id='password' />
      </label>
      <br />
      <label>
        Имя:
        <input type='text' id='name1' />
      </label>

      <br />
      <label>
        Телефон:
        <input type='text' id='contactPhone' />
      </label>

      <br />
      <button type='submit'>Зарегистрироваться</button>
    </form>
  );
}

export default Register;

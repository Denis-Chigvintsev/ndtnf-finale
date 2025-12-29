import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap } from 'rxjs';

let email;
let password;
let name1;
let contactPhone;
let role;

//import s from './Register.module.css';

function UserCreationAdmin() {
  function handleFormSubmit(e) {
    e.preventDefault();

    role = e.target.role_uca.value;

    const register = {
      email: email,
      password: password,
      name: name1,
      contactPhone: contactPhone,
      role: role,
    };

    e.target.email_uca.value = '';
    e.target.password_uca.value = '';
    e.target.name1_uca.value = '';
    e.target.contactPhone_uca.value = '';

    from(JSON.stringify(register))
      .pipe(
        exhaustMap((data) => {
          return fetch('http://localhost/authentication/createuser/admin', {
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
    const email_ = document.getElementById('email_uca');
    const email$ = fromEvent(email_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(1)
      )
      .subscribe((data) => {
        email = data;
      });

    const password_ = document.getElementById('password_uca');
    const pss$ = fromEvent(password_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(1)
      )
      .subscribe((data) => {
        password = data;
      });

    const name1_ = document.getElementById('name1_uca');
    const name1$ = fromEvent(name1_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(1)
      )
      .subscribe((data) => {
        name1 = data;
      });

    const contactPhone_ = document.getElementById('contactPhone_uca');
    const contactPhone$ = fromEvent(contactPhone_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(1)
      )
      .subscribe((data) => {
        contactPhone = data;
      });

    const role_ = document.getElementById('role_uca');
    const role$ = fromEvent(role_, 'change')
      .pipe(
        map((e) => e.target.value),
        debounceTime(300)
      )
      .subscribe((data) => {
        role = data;
      });
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <br />
      <h3>Создание пользователя админом // Admin </h3>
      <label>
        Электронная почта:
        <input id='email_uca' type='text' />
      </label>
      <br />
      <label>
        Пароль:
        <input type='text' id='password_uca' />
      </label>
      <br />
      <label>
        Имя:
        <input type='text' id='name1_uca' />
      </label>

      <br />
      <label>
        Телефон:
        <input type='text' id='contactPhone_uca' />
      </label>

      <br />
      <label>
        Выбрать категорию:
        <select id='role_uca'>
          <option value='client'> Client</option>
          <option value='manager'> Manager</option>
          <option value='admin'> Admin</option>
        </select>
      </label>

      <br />
      <button type='submit'>Зарегистрировать пользователя</button>
    </form>
  );
}

export default UserCreationAdmin;

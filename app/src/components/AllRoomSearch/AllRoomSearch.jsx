import s from './AllRoomSearch.module.css';

function AllRoomSearch() {
  function HandleClick() {
    console.log("click")
  }
  return (
    <div>
      <button onClick={HandleClick}>Вывести список всех комнат</button>
    </div>
  );
}
export default AllRoomSearch;

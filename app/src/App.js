import './App.css';

import UpperMenu from './components/UpperMenu/UpperMenu';
import Form1 from './components/Form1.jsx/Form1';
import Form1Results from './components/AllRoomSearch/AllRoomSearch';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AllRoomSearch from './components/AllRoomSearch/AllRoomSearch';
import AddNewHotel from './components/AddNewHotel/AddNewHotel';
import RoomCreate from './components/RoomCreate/RoomCreate';
import RoomList from './components/RoomList/RoomList';

import UpdateHotel from './components/UpdateHotel/UpdateHotel';
import GetOneRoom from './components/GetOneRoom/GetOneRoom';
import RoomEdit from './components/RoomEdit/RoomEdit';
import CreateReservationClient from './components/CreateReservationClient/CreateReservationClient';
import UserReservationsList from './components/UserReservationsList/UserReservationsList';
import DeleteReservation from './components/DeleteReservation/DeleteReservation';
import UserUpgrade from './components/UserUpgrade/UserUpgrade';
import ListOfUsers from './components/ListOfUsers/ListOfUsers';
import UserUpgradeAdmin from './components/UserUpgrade/UserUpgradeAdmin';
import UserDowngradeClients from './components/UserUpgrade/UserDowngradeClient';
import ListOfReservationsManager from './components/ListOfReservationsManager/ListOfReservationsManager';
import DeleteReservationByManager from './components/DeleteReservation/DeleteReservationByManager';
import UserCreationAdmin from './components/UserCreationAdmin/UserCreationAdmin';
import SupportRequestCreation from './components/SupportRequestCreation/SupportRequestCreation';
import ListOfRequestsManager from './components/ListofRequestsManager/ListOfRequestsManager';
import ListOfRequestsClient from './components/ListOfRequestsClient/ListOfRequestsClients';
import SendMessageHttp from './components/SendMessageHttp/SendMessageHttp';
import SendConfirmation from './components/SendConfirmation/SendConfirmation';
import Socket from './components/Socket/Socket';

function App() {
  return (
    <div className='App'>
      <h2>Тестирование бакенда "Агрегатор Отелей"</h2>
      <Register />
      <Login />
      <Form1 />
      <AddNewHotel />
      <UpdateHotel />
      <RoomCreate />
      <RoomList />
      <GetOneRoom />
      <RoomEdit />
      <CreateReservationClient />
      <UserReservationsList />
      <DeleteReservation />
      <UserUpgrade />
      <ListOfUsers />
      <UserUpgradeAdmin />
      <UserDowngradeClients />
      <ListOfReservationsManager />
      <DeleteReservationByManager />
      <UserCreationAdmin />
      <SupportRequestCreation />
      <ListOfRequestsManager />
      <ListOfRequestsClient />
      <SendMessageHttp />
      <SendConfirmation />
      <Socket />
    </div>
  );
}

export default App;

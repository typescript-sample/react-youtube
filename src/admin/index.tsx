import { Route, Routes } from 'react-router';
import { UsersForm } from '../users/users-form';

export default function Admin() {
  return (
    <Routes>
      <Route path='users' element={<UsersForm />} />
    </Routes>
  );
}

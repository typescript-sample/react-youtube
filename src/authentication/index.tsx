import { Route, Routes } from 'react-router';
import { SigninForm } from './signin-form';

export default function Authentication() {
  return (
    <Routes>
      <Route path='signin' element={<SigninForm/>} />
    </Routes>
  );
}

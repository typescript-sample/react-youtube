import { Route, Routes } from "react-router"
import { UserForm } from "./user-form"
import { UsersForm } from "./users-form"

export default function UsersRoute() {
  return (
    <Routes>
      <Route path="" element={<UsersForm />} />
      <Route path="/new" element={<UserForm />} />
      <Route path="/:id" element={<UserForm />} />
    </Routes>
  )
}

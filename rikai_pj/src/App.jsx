import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompanyForm from "./components/Companies/CompanyForm";
import UserForm from "./components/Users/UserForm";
import UserList from "./components/Users/UserList";
import HomePage from "./page/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies/new" element={<CompanyForm />} />

        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

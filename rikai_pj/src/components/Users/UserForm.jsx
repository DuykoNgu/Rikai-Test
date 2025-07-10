import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNewUsers,
  getAllUsers,
  getAllCompanies,
  getById,
  updateUser,
} from "../../services";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const usersSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "email is required"),
  created_at: z.string().default(() => new Date().toISOString()),
  company_id: z.coerce.number().min(1, "Please select a company"),
});

const UserForm = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [nameError, setNameError] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({ resolver: zodResolver(usersSchema) });

  useEffect(() => {
    (async () => {
      const userData = await getAllUsers("/users");
      setUsers(userData);
      const companyData = await getAllCompanies("/companies");
      setCompanies(companyData);
    })();
  }, []);

  useEffect(() => {
    if (id) {
      (async () => {
        const data = await getById(`/users`, id);
        reset(data);
      })();
    }
  }, [id, reset]);

  const onSubmit = async (user) => {
    if (id) {
      await updateUser(`/users`, id, user);
      nav("/users");
      return;
    }

    const isNameExist = users.some(
      (u) =>
        u.name.trim().toLowerCase() === user.name.trim().toLowerCase() &&
        (!id || String(u.id) !== String(id))
    );
    if (isNameExist) {
      setNameError("This name has already been used");
      return;
    }

    const isEmailExist = users.some(
      (u) =>
        u.email.trim().toLowerCase() === user.email.trim().toLowerCase() &&
        (!id || String(u.id) !== String(id))
    );
    if (isEmailExist) {
      setNameError("This email has already been used");
      return;
    }

    setNameError("");
    await createNewUsers("/users", user);
    nav("/users");
  };

  return (
    <div>
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">
                  {id ? "Edit" : "Add"} User
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name User
                    </label>
                    <input
                      type="text"
                      placeholder="Name"
                      className={`form-control ${
                        errors.name || nameError ? "is-invalid" : ""
                      }`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                    )}
                    {nameError && (
                      <div className="invalid-feedback d-block">
                        {nameError}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      className={`form-control ${
                        errors.email ||
                        nameError === "This email has already been used"
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    )}
                    {nameError === "This email has already been used" && (
                      <div className="invalid-feedback d-block">
                        {nameError}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="company_id" className="form-label">
                      Company
                    </label>
                    <select
                      className={`form-select ${
                        errors.company_id ? "is-invalid" : ""
                      }`}
                      {...register("company_id")}
                      defaultValue=""
                    >
                      <option value="">Select company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {errors.company_id && (
                      <div className="invalid-feedback">
                        {errors.company_id?.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="created_at" className="form-label">
                      Created At
                    </label>
                    <input
                      type="datetime-local"
                      className={`form-control ${
                        errors.created_at ? "is-invalid" : ""
                      }`}
                      {...register("created_at")}
                      defaultValue={new Date().toISOString().slice(0, 16)}
                    />
                    {errors.created_at && (
                      <div className="invalid-feedback">
                        {errors.created_at?.message}
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        reset();
                        setNameError("");
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                    >
                      {id ? "Edit" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

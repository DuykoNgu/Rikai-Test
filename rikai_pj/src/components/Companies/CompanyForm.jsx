import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewCompany } from "../../services";
import { useNavigate } from "react-router-dom";

const companiesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  created_at: z.string().default(() => new Date().toISOString()),
});

const CompanyForm = () => {
  const nav = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [nameError, setNameError] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({ resolver: zodResolver(companiesSchema) });

  useEffect(() => {
    (async () => {
      const data = await getAll("/companies");
      setCompanies(data);
    })();
  }, []);

  const onSubmit = async (company) => {
    const isExist = companies.some(
      (c) => c.name.trim().toLowerCase() === company.name.trim().toLowerCase()
    );
    if (isExist) {
      setNameError("This name has already been used");
      return;
    }
    setNameError("");
    await createNewCompany("/companies", company);
    nav("/");
    reset();
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Adding Companies</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name Company
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
                    <div className="invalid-feedback d-block">{nameError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address Company
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    {...register("address")}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address?.message}
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
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllCompanies, removeUser } from "../../services";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userData = await getAllUsers("/users");
      setUsers(userData);
      const companyData = await getAllCompanies("/companies");
      setCompanies(companyData);
    })();
  }, []);

  const handleRemove = async (id) => {
    const res = await removeUser(`/users`, id); // hoặc `/users/${id}` tùy service bạn viết
    if (res) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } else {
      alert("Xóa không thành công!");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesCompany = selectedCompany
      ? String(user.company_id) === String(selectedCompany)
      : true;
    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCompany && matchesSearch;
  });

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentData = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [selectedCompany, totalPages, currentPage]);

  return (
    <div>
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center">
          <div className="col-md-10">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1 className="mb-0 text-center flex-grow-1">Users list</h1>
                  <Link to={`/users/new`} className="btn btn-success ms-3">
                    Add company
                  </Link>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label me-2">Filter by company:</label>
                    <select
                      className="form-select w-auto d-inline-block"
                      value={selectedCompany}
                      onChange={(event) => setSelectedCompany(event.target.value)}
                    >
                      <option value="">All companies</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label me-2">Search by name:</label>
                    <input
                      type="text"
                      className="form-control w-auto d-inline-block"
                      placeholder="Enter user name..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                </div>
                <table className="table table-striped table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Create_At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData && currentData.length > 0 ? (
                      currentData.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.created_at}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => navigate(`/users/edit/${item.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                handleRemove(item.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Không có sản phẩm nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <nav>
                  <ul className="pagination justify-content-end">
                    <li
                      className={`page-item${
                        currentPage === 1 ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item${
                          currentPage === i + 1 ? " active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item${
                        currentPage === totalPages ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="navigate-button"
          aria-label="Back to Companies list"
        >
          <span style={{ fontSize: "24px" }}>&rarr;</span>
          <span style={{ fontWeight: 200, fontSize: "20px" }}>
            Back to Companies list
          </span>
        </button>
      </div>
    </div>
  );
};

export default UserList;

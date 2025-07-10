import React, { useEffect, useState } from "react";
import { getAllCompanies, removeCompany } from "../../services";
import { Link, useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

const CompanyList = () => {
  const [value, setValue] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getAllCompanies("/companies");
      setValue(data);
    })();
  }, []);

  const handleRemove = async (id) => {
    const res = await removeCompany(`/companies`, id);
    if (res) {
      setValue((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } else {
      alert("Xóa không thành công!");
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(value.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentData = value.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0 text-center flex-grow-1">Companies list</h1>
                <Link to={`/companies/new`} className="btn btn-success ms-3">
                  Add company
                </Link>
              </div>
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name Companies</th>
                    <th>Address</th>
                    <th>Create_At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData && currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>{item.created_at}</td>
                        <td>
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
              {/* Pagination controls */}
              <nav>
                <ul className="pagination justify-content-end">
                  <li
                    className={`page-item${
                      currentPage === 1 ? " disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
        onClick={() => navigate("/users")}
        className="navigate-button"
        aria-label="Go to users"
      >
        <span style={{ fontSize: "24px" }}>&rarr;</span>
        <span style={{ fontWeight: 200, fontSize: "20px" }}>Go to users</span>
      </button>
    </div>
  );
};

export default CompanyList;

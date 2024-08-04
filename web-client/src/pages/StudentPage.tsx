import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ContentHeader from "@/components/ContentHeader";
import { AppDispatch } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import {
  Delete,
  list,
  setItemPerPage,
  setPage,
  setSearch,
} from "@/stores/slices/studentSlice";
import useDebounce from "@/libs/debounce";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";

const StudentPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const students = useSelector((state: RootState) => state.student.students);
  const currentPage = useSelector(
    (state: RootState) => state.student.currentPage
  );
  const totalItems = useSelector(
    (state: RootState) => state.student.totalItems
  );
  const itemsPerPage = useSelector((state: RootState) => state.student.perPage);
  const loading = useSelector((state: RootState) => state.student.isLoading);
  const search = useSelector((state: RootState) => state.student.search);

  const debounceSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleItemPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemPerPage = parseInt(e.target.value);
    dispatch(setItemPerPage(newItemPerPage));
    dispatch(setPage(1));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    dispatch(setPage(selectedItem.selected + 1));
  };

  const handleDelete = async (id: number) => {
    const response = await dispatch(Delete({ id }));
    if (Delete.fulfilled.match(response)) {
      toast.success("Student Successfully Deleted.");
      const response = await dispatch(
        list({
          page: currentPage,
          per_page: itemsPerPage,
          search: debounceSearch || "",
        })
      );
      if (list.fulfilled.match(response)) {
        const currentPageItems = response.payload?.data?.data.length || 0;
        if (currentPageItems === 0 && currentPage > 1) {
          dispatch(setPage(currentPage - 1));
        }
      }
    } else {
      toast.info((response.payload as { message: string }).message);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await dispatch(
        list({
          page: currentPage,
          per_page: itemsPerPage,
          search: debounceSearch || "",
        })
      );
      if (
        list.fulfilled.match(response) &&
        response.payload?.data.data.length === 0 &&
        debounceSearch
      ) {
        toast.info("No Data Found.");
      }
    };

    fetchStudents();
  }, [dispatch, currentPage, itemsPerPage, debounceSearch]);

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(startEntry + itemsPerPage - 1, totalItems);
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <ToastContainer />
      <ContentHeader title="Student" />
      <div className="content">
        <div className="container-fluid">
          <div className="card card-outline card-dark">
            <div className="card-header d-flex justify-content-between">
              <Link to="/form/new" className="btn btn-dark">
                Create
              </Link>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div className="form-group d-flex" style={{ width: 55 }}>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemPerPage}
                    className="form-control"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div className="form-inline">
                  <div className="form-group">
                    <label className="text-muted mr-2">Search:</label>
                    <input
                      value={search}
                      onChange={handleSearch}
                      type="text"
                      className="form-control"
                      style={{ width: 200 }}
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Created_At</th>
                      <th>Updated_At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>
                            {student.status === "Active" ? (
                              <span className="badge badge-success">
                                {student.status}
                              </span>
                            ) : student.status === "Inactive" ? (
                              <span className="badge badge-danger">
                                {student.status}
                              </span>
                            ) : null}
                          </td>
                          <td>{student.created_at}</td>
                          <td>{student.updated_at}</td>
                          <td>
                            <Link
                              to={`/form/edit?id=${student.id}`}
                              className="btn btn-primary"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between text-align-center mt-3">
                <div>
                  <p>
                    Show {startEntry} to {endEntry} of {totalItems} entries
                  </p>
                </div>
                <div>
                  <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPage;

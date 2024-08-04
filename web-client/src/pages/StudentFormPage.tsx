import ContentHeader from "@/components/ContentHeader";
import { create, getStudentID, Update } from "@/stores/slices/studentSlice";
import { AppDispatch } from "@/stores/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { RootState } from "@/stores/store";
import { getImageURL } from "@/libs/getImageURL";

interface FormState {
  name: string;
  status: string;
  image: File | null | undefined;
}

const StudentFormPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.student);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const operation = params.operation;
  const studentId = searchParams.get("id");
  const formTitle = operation === "new" ? "Create New Student" : "Edit Student";
  const [selectedFileName, setSelectedFileName] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    status: "",
    image: null,
  });

  useEffect(() => {
    if (studentId) {
      dispatch(getStudentID(parseInt(studentId))).then((response) => {
        if (getStudentID.fulfilled.match(response)) {
          const student = response.payload;
          setForm({
            name: student?.data.name,
            status: student?.data.status,
            image: null,
          });
          setExistingImage(student?.data.image);
        }
      });
    }
  }, [dispatch, studentId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFileName(file.name);
      setForm({ ...form, image: file });
    } else {
      setSelectedFileName("");
      setForm({ ...form, image: null });
    }
  };

  const onSubmitForm = async () => {
    const resultAction = await dispatch(create({ ...form }));
    if (create.fulfilled.match(resultAction)) {
      setForm({ name: "", status: "", image: null });
      setSelectedFileName("");
      toast.success("Student Created Successfully");
      setExistingImage(null);
    } else {
      toast.info((resultAction.payload as { message?: string }).message);
    }
  };

  const onUpdateForm = async () => {
    const payload: any = {
      id: studentId,
      name: form.name,
      status: form.status,
      image: form.image,
    };
    const response = await dispatch(Update(payload));
    if (Update.fulfilled.match(response)) {
      const success = response.payload?.success;
      if (success) {
        setTimeout(() => {
          toast.success("Student Updated Successfully");
        }, 500);
        navigate("/student");
      }
    } else {
      toast.info((response.payload as { message?: string }).message);
    }
  };

  return (
    <>
      <ToastContainer />
      <ContentHeader title={formTitle} />
      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <Link to="/student" className="btn btn-dark">
                Back
              </Link>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  type="text"
                  className="form-control"
                />
                <small className="form-text text-muted">
                  Please enter a valid name
                </small>
              </div>

              <label>Avatar</label>
              <div className="input-group mb-3">
                <div className="custom-file">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="custom-file-input"
                  />
                  <label className="custom-file-label">
                    {selectedFileName || "Choose File"}
                  </label>
                </div>
              </div>

              {(form.image || existingImage) && (
                <div className="mb-3">
                  <img
                    src={getImageURL(form.image || existingImage)}
                    alt="Selected or Existing"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              )}

              <label>Status</label>
              <div className="form-group mb-3">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    value="Active"
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    checked={form.status === "Active"}
                  />
                  <label className="form-check-label">Active</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    value="Inactive"
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    checked={form.status === "Inactive"}
                  />
                  <label className="form-check-label">Inactive</label>
                </div>
              </div>
              {operation === "new" ? (
                <button
                  onClick={onSubmitForm}
                  className="btn btn-dark"
                  disabled={isLoading}
                >
                  {isLoading ? <span>Loading...</span> : "Create"}
                </button>
              ) : operation === "edit" ? (
                <button
                  onClick={onUpdateForm}
                  disabled={isLoading}
                  className="btn btn-info"
                >
                  {isLoading ? <span>Loading...</span> : "Edit"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentFormPage;

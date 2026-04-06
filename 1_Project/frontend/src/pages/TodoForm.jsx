import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { API } from "../api/api";

const TodoForm = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [todo, setTodo] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  useEffect(() => {
    if (!isEdit) return;

    const fetchTodo = async () => {
      setFetching(true);
      try {
        const response = await API.get(`/todo/${id}`);
        setTodo(response.data);
      } catch (err) {
        setError("Failed to fetch todo");
      } finally {
        setFetching(false);
      }
    };

    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const title = form.get("title");
    const description = form.get("description");
    const completed = form.get("completed") === "on";

    try {
      if (isEdit) {
        await API.put(`/todo/${id}/update`, {
          title,
          description,
          completed,
        });
      } else {
        await API.post("/todo/new_todo", {
          title,
          description,
          completed,
        });
      }

      navigate("/");
    } catch (err) {
      setError(`Failed to ${isEdit ? "update" : "create"} todo`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="container mt-5 text-center">
        Loading todo...
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-4">
            {isEdit ? "Edit Todo" : "Add New Todo"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                defaultValue={todo?.title || ""}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                defaultValue={todo?.description || ""}
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                name="completed"
                className="form-check-input"
                id="completed"
                defaultChecked={todo?.completed || false}
              />
              <label className="form-check-label" htmlFor="completed">
                Completed
              </label>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update Todo"
                  : "Add Todo"}
              </button>

              <Link to="/" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;
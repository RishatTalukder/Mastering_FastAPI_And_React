import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";

const TodoForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const todo = location.state?.todo;
  const isEdit = !!todo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const title = form.get("title");
    const description = form.get("description");
    const completed = form.get("completed") === "on";

    try {
      if (isEdit) {
        await axios.put(`api/todo/${todo.id}/update`, {
          title: title,
          description: description,
          completed: completed,
        });
      } else {
        await axios.post("api/todo/new_todo", {
          title: title,
          description: description,
          completed: completed,
        });
      }
      navigate("/");
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} todo`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isEdit ? 'Edit Todo' : 'Add New Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            defaultValue={todo?.title || ''}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            defaultValue={todo?.description || ''}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="completed"
            name="completed"
            defaultChecked={todo?.completed || false}
          />
          <label className="form-check-label" htmlFor="completed">
            Completed
          </label>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Todo' : 'Add Todo')}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;

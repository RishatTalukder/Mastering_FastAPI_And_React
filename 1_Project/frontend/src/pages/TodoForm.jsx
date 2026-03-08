import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const TodoForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      await axios.post("http://localhost:8000/api/todo/new_todo", {
        title: title,
        description: description,
        completed: completed,
      });
      navigate("/");
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Todo</h2>
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
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="completed"
            name="completed"
          />
          <label className="form-check-label" htmlFor="completed">
            Completed
          </label>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { API } from "../api/api";

const TodoForm = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [todo, setTodo] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // fetch todo if edit mode
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

  // loading state while fetching todo
  if (fetching) return <div>Loading todo...</div>;

  return (
    <div>
      <h2>{isEdit ? "Edit Todo" : "Add New Todo"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            defaultValue={todo?.title || ""}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={todo?.description || ""}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="completed"
              defaultChecked={todo?.completed || false}
            />
            Completed
          </label>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
            ? "Update Todo"
            : "Add Todo"}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
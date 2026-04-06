import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { API } from '../api/api'

const TodoDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todo, setTodo] = useState(null);

  const fetchTodo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/todo/${id}`);
      setTodo(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  if (loading)
    return (
      <div className="container mt-5 text-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Error: {error.message}
        </div>
      </div>
    );

  if (!todo)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Todo not found
        </div>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">

          <h3 className="card-title mb-3">{todo.title}</h3>

          <p className="card-text">
            {todo.description || "No description provided."}
          </p>

          <span
            className={`badge ${
              todo.completed ? "bg-success" : "bg-secondary"
            }`}
          >
            {todo.completed ? "Completed" : "Not Completed"}
          </span>

          <div className="mt-4 d-flex gap-2">
            <Link
              to={`/edit/${todo.id}`}
              className="btn btn-outline-primary"
            >
              Edit
            </Link>

            <Link
              to="/"
              className="btn btn-outline-secondary"
            >
              Back
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TodoDetails;
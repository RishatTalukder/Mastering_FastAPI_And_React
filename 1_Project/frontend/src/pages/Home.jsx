import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { API } from "../api/api";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/todo/");
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todo/${id}/delete`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="container mt-5">
        <div className="text-center">Loading...</div>
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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Todos</h1>
        <Link to="/new" className="btn btn-primary">
          Add New
        </Link>
      </div>

      <div className="list-group">
        {data.map((item) => (
          <div
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link
              to={`/todo/${item.id}`}
              className="text-decoration-none flex-grow-1"
            >
              {item.title}
            </Link>

            <div className="btn-group">
              <Link
                to={`/edit/${item.id}`}
                className="btn btn-sm btn-outline-secondary"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(item.id)}
                className="btn btn-sm btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
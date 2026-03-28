import React, { useEffect, useState } from "react";
import axios from "axios";
import NewTodo from "../components/NewTodo";
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
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      // always executed
      console.log("done");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Home</h1>
      {/* <NewTodo setData={setData}/> */}
      <Link to={'/new'}>
        Add new
      </Link>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.title}
            <Link to={`/edit/${item.id}`} state={{ todo: item }}>
              <button>Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

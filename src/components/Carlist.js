import React, { useState, useEffect } from "react";
import ReactTable from "react-table";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Addcar from "./Addcar";
import Editcar from "./Editcar";
import "react-table/react-table.css";
import { CSVLink } from "react-csv";
import Grid from "@material-ui/core/Grid";

const Carlist = () => {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const columns = [
    {
      Header: "Brand",
      accessor: "brand"
    },
    {
      Header: "Model",
      accessor: "model"
    },
    {
      Header: "Color",
      accessor: "color"
    },
    {
      Header: "Year",
      accessor: "year"
    },
    {
      Header: "Fuel",
      accessor: "fuel"
    },
    {
      Header: "Price (€)",
      accessor: "price"
    },
    {
      sortable: false,
      filterable: false,
      width: 100,
      accessor: "_links.self.href",
      Cell: row => <Editcar car={row.original} updateCar={updateCar} />
    },
    {
      sortable: false,
      filterable: false,
      width: 100,
      accessor: "_links.self.href",
      Cell: ({ value }) => (
        <Button size="small" color="secondary" onClick={() => deleteCar(value)}>
          Delete
        </Button>
      )
    }
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then(response => response.json())
      .then(data => setCars(data._embedded.cars))
      .catch(err => console.error(err));
  };

  const deleteCar = link => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then(res => fetchCars())
        .then(res => setMessage("Car deleted"))
        .then(res => setOpen(true))
        .catch(err => console.error(err));
    }
  };

  const saveCar = newCar => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(newCar)
    })
      .then(res => fetchCars())
      .then(res => setMessage("Car save successfully"))
      .then(res => setOpen(true))
      .catch(err => console.error(err));
  };

  const updateCar = (car, link) => {
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(car)
    })
      .then(res => fetchCars())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Grid container>
        <Grid item>
          <Addcar saveCar={saveCar} />
        </Grid>
        <Grid style={{ padding: 15 }} item>
          <CSVLink data={cars}>Export data</CSVLink>
        </Grid>
      </Grid>
      <ReactTable
        defaultPageSize={15}
        data={cars}
        columns={columns}
        filterable={true}
      />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
};

export default Carlist;

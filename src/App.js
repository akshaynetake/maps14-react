import React, { useState } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";  // ← v4 styles
import {
  LoadScript
} from "@react-google-maps/api";
import Map from "./components/map/Map.js";
import inilocations from "../src/data/location.json";
import {
  FormControl,
  InputLabel,
  Box,
  Button,
  Modal,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid
} from "@material-ui/core";  // ← All v4 imports

const useStyles = makeStyles((theme) => ({
  appContainer: {
    padding: theme.spacing(3),
    maxWidth: 1200,
    margin: "0 auto"
  },
  formContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2)
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    maxHeight: 400
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    height: "95%",
    bgcolor: "background.paper",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    borderRadius: 8
  },
  mapContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden"
  }
}));

const cities = [
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Noida", lat: 28.5355, lng: 77.391 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 }
];

function App() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState(cities[6]); // Mumbai
  const [locations, setLocations] = useState(inilocations); // ← Empty array initially
  const [form, setForm] = useState({
    name: "",
    type: "",
    bhk: "",
    carpet: "",
    price: "",
    priceCr: "",
    lat: "",
    lng: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocations((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        type: form.type,
        bhk: Number(form.bhk),
        carpet: Number(form.carpet),
        price: Number(form.price),
        priceCr: Number(form.priceCr),
        lat: Number(form.lat),
        lng: Number(form.lng)
      }
    ]);
    setForm({
      name: "",
      type: "",
      bhk: "",
      carpet: "",
      price: "",
      priceCr: "",
      lat: "",
      lng: ""
    });
  };

  return (
    <div className={classes.appContainer}>
      {/* City Selector */}
      <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: 16 }}>
        <InputLabel>Center City</InputLabel>
        <Select
          value={center.name}
          label="Center City"
          onChange={(e) =>
            setCenter(cities.find((c) => c.name === e.target.value))
          }
        >
          {cities.map((c) => (
            <MenuItem key={c.name} value={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Open Map Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Open Map
      </Button>

      {/* Property Form */}
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="BHK"
          type="number"
          value={form.bhk}
          onChange={(e) => setForm({ ...form, bhk: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Carpet Area"
          type="number"
          value={form.carpet}
          onChange={(e) => setForm({ ...form, carpet: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Price Cr"
          type="number"
          value={form.priceCr}
          onChange={(e) => setForm({ ...form, priceCr: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Latitude"
          type="number"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          variant="outlined"
        />
        <TextField
          label="Longitude"
          type="number"
          value={form.lng}
          onChange={(e) => setForm({ ...form, lng: e.target.value })}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          style={{ height: 55 }}
        >
          Add Property
        </Button>
      </form>

      {/* Properties Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>BHK</TableCell>
              <TableCell>Carpet</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Price Cr</TableCell>
              <TableCell>Lat</TableCell>
              <TableCell>Lng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type || "-"}</TableCell>
                <TableCell>{row.bhk ?? "-"}</TableCell>
                <TableCell>{row.carpet ?? "-"}</TableCell>
                <TableCell>{row.price ?? "-"}</TableCell>
                <TableCell>{row.priceCr ?? "-"}</TableCell>
                <TableCell>{row.lat}</TableCell>
                <TableCell>{row.lng}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Map Modal */}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}  // ← Fixed env var
        libraries={["places"]}
      >
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className={classes.modalStyle}>
            <Box className={classes.mapContainer}>
              <Map center={center} locations={locations} setOpenFilters={setOpen}/>
            </Box>
          </Box>
        </Modal>
      </LoadScript>
    </div>
  );
}

export default App;

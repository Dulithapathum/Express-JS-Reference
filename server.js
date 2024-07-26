import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const users = [
  {
    id: 1,
    name: "dulitha Pathum",
    age: 23,
  },
  {
    id: 2,
    name: "amila karunarathna",
    age: 25,
  },
  {
    id: 3,
    name: "kasun rathnayaka",
    age: 35,
  },
];

app.get("/", (req, res) => {
  res.status(200).send("This is Home Page");
  console.log(`Site Url :${req.url}`);
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
  console.log(`Site Url :${req.url}`);
});

app.get("/users/:id", (req, res) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) {
    return res.status(400).send("Bad Request");
  }
  const findValue = users.find((user) => {
    return user.id === parseId;
  });

  if (!findValue) {
    return res.status(404).send("User Can not Find");
  } else {
    return res.send(findValue);
  }
});

app.listen(PORT, () => {
  console.log("Server Is Running");
});

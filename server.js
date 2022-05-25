const http = require("http");
const fs = require("fs");

const dataBase = "dataBase.JSON";

const port = 8080;
const server = http.createServer((req, res) => {
  const items = req.url.split("/");

  if (req.method === "GET" && items[1] === "todos" && items.length === 2) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    fs.readFile(dataBase, "utf8", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const printData = JSON.parse(data);
        res.end(JSON.stringify(printData));
      }
    });
  } else if (
    req.method === "GET" &&
    items[1] === "todos" &&
    items.length === 3
  ) {
    fs.readFile(dataBase, "utf-8", (err, data) => {
      const objects = JSON.parse(data);
      const reqId = parseInt(items[2]);
      const reqOb = objects.find((obi) => obi.id === reqId);

      if (reqOb) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify(reqOb));
      } else {
        res.statusCode = 404;
        res.write("Not Found");
        res.end();
      }
    });
  } else if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.statusCode = 200;

    res.end();
  } else if (req.method === "POST" && items[1] === "todos") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let body = "";
    req.on("data", (chunk) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      body += chunk;
    });
    req.on("end", () => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      let inputData = JSON.parse(fs.readFileSync(dataBase));
      let post = body;

      const getId = Math.floor(
        Math.random() * (100 - JSON.parse(fs.readFileSync(dataBase)).length) + 1
      );
      let newInPutData = JSON.parse(post);
      newInPutData.id = getId;
      inputData.push(newInPutData);

      res.statusCode = 201;
      fs.writeFile(dataBase, JSON.stringify(inputData, null, "   "), (err) => {
        if (err) {
          console.error("Shit happens!");
        }
      });
      res.end();
    });
  } else if (
    req.method === "PUT" &&
    items[1] === "todos" &&
    items.length === 3
  ) {
    let body = "";
    const post = items[2];
    let inputData = JSON.parse(fs.readFileSync(dataBase));

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      res.statusCode = 200;

      const removeById = (id2Delete, id) => {
        const requiredIndex = id2Delete.findIndex((el) => {
          return el.id === parseInt(id);
        });
        if (requiredIndex === -1) {
          res.statusCode = 404;
          return false;
        }
        return !!inputData.splice(requiredIndex, 1);
      };

      removeById(inputData, post);

      let newInPutData = JSON.parse(body);
      newInPutData.id = post;
      inputData.push(newInPutData);
      fs.writeFile(dataBase, JSON.stringify(inputData, null, "   "), (err) => {
        if (err) {
          console.error("Shit happens!");
        }
      });
    });
    res.end();
  } else if (
    req.method === "DELETE" &&
    items[1] === "todos" &&
    items.length === 3
  ) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    const post = items[2];
    let inputData = JSON.parse(fs.readFileSync(dataBase));
    res.statusCode = 200;
    const removeById = (id2Delete, id) => {
      const requiredIndex = id2Delete.findIndex((el) => {
        return el.id === parseInt(id);
      });
      if (requiredIndex === -1) {
        res.statusCode = 404;
        return false;
      }
      return !!inputData.splice(requiredIndex, 1);
    };
    removeById(inputData, post);
    fs.writeFile(dataBase, JSON.stringify(inputData, null, "   "), (err) => {
      if (err) {
        console.error("Shit happens!");
      }
    });
    res.end();
  } else if (
    req.method === "PATCH" &&
    items[1] === "todos" &&
    items.length === 3
  ) {
    let body = "";
    const post = items[2];
    let inputData = JSON.parse(fs.readFileSync(dataBase));
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      inputDataIndex = inputData.findIndex((obj) => obj.id == post);
      if (JSON.parse(body).title) {
        inputData[inputDataIndex].title = JSON.parse(body).title;
      }
      if (JSON.parse(body).completed) {
        inputData[inputDataIndex].completed = JSON.parse(body).completed;
      }
      fs.writeFile(dataBase, JSON.stringify(inputData, null, "   "), (err) => {
        if (err) {
          console.error("Shit happens");
        }
      });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

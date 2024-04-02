// to run -- node http-server.js
const http = require("http");

const PORT = 3000;

const server = http.createServer();

const friends = [
  {
    id: 0,
    name: "Nikola Tesla",
  },
  {
    id: 1,
    name: "Sir Isaac Newton",
  },
  {
    id: 2,
    name: "Albert Einstein",
  },
];
//GET - Request http://localhost:3000/friends
// POST request to friends - paste this below code in console
/*
  paste this code in console to make a POST request with payload
fetch("http://localhost:3000/friends",{
    method:"POST",
    body: JSON.stringify({id:5,name:"Johnny"})
})
.then((response)=>response.json())
.then((friend)=>console.log("friend",friend))
*/
http: server.on("request", (req, res) => {
  console.log("req.url", req.url);
  const items = req.url.split("/");

  if (req.method === "POST" && items[1] === "friends") {
    req.on("data", (data) => {
      const friend = data.toString();
      console.log("Request:", friend);
      friends.push(JSON.parse(friend));
    });
    //  we pass in some JSON data in the readable stream and then pipe it into the readable stream, which is the response to send back that same JSON back to the browser.
    req.pipe(res);
  } else if (req.method === "GET" && items[1] === "friends") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    //localhost:3000/friends/1
    http: if (items.length === 3) {
      const friendIndex = Number(items[2]);
      res.end(JSON.stringify(friends[friendIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  }
  // http://localhost:3000/messages
  else if (req.method === "GET" && items[1] === "messages") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<body>");
    res.write("<ul>");
    res.write("<li>Hello Isaac!</li>");
    res.write("<li>What are your thoughts on astronomy?</li>");
    res.write("</ul>");
    res.write("</body>");
    res.write("</html>");
    // end the response
    res.end();
  } else {
    res.statusCode = 404;
    // end the response
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
}); //127.0.0.1 => localhost

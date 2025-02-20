async function fetchGreeting() {
  const response = await fetch("http://localhost:9000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "query { greeting }",
    }),
  });
  const body = await response.json();
  return body.data.greeting;
  // short hand
  // const { data } = await response.json();
  // return data.greeting;
}

fetchGreeting().then((greeting) => {
  document.getElementById("greeting").textContent = greeting;
});

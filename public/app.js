// Grab the articles as json
$.getJSON("/articles", (data) => {
  console.log(data);

  // For each one
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    // Display the apropos information on the page
    $("#articles").append(`<p data-id=${data[i].id}>${data[i].title}<br />${data[i].link}</p>`);
  }
});
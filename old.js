function init() {
  const URL =
    "https://en.wikipedia.org/w/api.php?" +
    $.param({
      origin: "*",
      format: "json",
      action: "parse",
      prop: "text",
      section: 0,
      page: $("#name").val(),
    });

  console.log(URL);
  fetch(URL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(json => {
      console.log(F.stringify(json));
      console.log(json);
      $("#json").html(
        JSON.stringify(json, null, 2)
          .split(" ")
          .join("&nbsp;")
          .split("\n")
          .join("<br />"),
      );

      return;
      var info = Object.values(json?.query?.pages)?.[0]
        ?.revisions[0]["*"].split("death_date")[1]
        ?.replace(/^ */, "")
        ?.slice(2)
        ?.split("\n")[0];

      console.log(info);
      $("#value").text(info || "None");
    })
    .catch(err => {
      throw err;
    });
}

async function init() {
  $("#value").text((await checkIfDead("Elizabeth II")) ? "YES! 🎉" : "no :(");
  $("#value_other").text(
    "Has Queen Elizabeth I (the original) died? - " +
      ((await checkIfDead("Elizabeth I")) ? "yes" : "no"),
  );
}

function checkIfDead(name) {
  return new Promise(resolve => {
    const URL =
      "https://en.wikipedia.org/w/api.php?" +
      $.param({
        origin: "*",
        format: "json",
        action: "query",
        prop: "revisions",
        rvprop: "content",
        titles: name,
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

        var info = Object.values(json?.query?.pages)?.[0]
          ?.revisions[0]["*"].split("death_date")[1]
          ?.replace(/^ */, "")
          ?.slice(2)
          ?.split("\n")[0];

        console.log(info);
        if (info) {
          resolve(true);
        }
        resolve(false);
      })
      .catch(err => {
        throw err;
      });
  });
}

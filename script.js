async function init() {
  $(".loading").css("display", "block");
  $(".check, .date").css("display", "none");
  $("body").removeClass("false").removeClass("true");
  $(".question").addClass("move");

  var deathDate = await getDeathDate("Elizabeth II");
  $(".loading").css("display", "none");
  $(".answer").text(deathDate ? "YES! 🎉" : "no 😢");

  if (deathDate) {
    $("body").addClass("true");
    $(".date").text(deathDate).css("display", "block");
    $(".question").removeClass("move");

    confetti({
      particleCount: 200,
      origin: { x: 0.5, y: 1 },
      scalar: 1.8,
    });
  } else {
    $("body").addClass("false");
    $(".check").css("display", "block");
    $(".question").removeClass("move");
  }
}

// Get death date from wikipedia page
function getDeathDate(name) {
  return new Promise(resolve => {
    fetch(
      "https://en.wikipedia.org/w/api.php?" +
        $.param({
          origin: "*",
          format: "json",
          action: "query",
          prop: "revisions",
          rvprop: "content",
          titles: name,
        }),
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then(res => res.json())
      .then(json => {
        // Parse data (very unreliable)
        var info = Object.values(json?.query?.pages)?.[0]
          ?.revisions[0]["*"].split("death_date")[1]
          ?.replace(/^ */, "")
          ?.slice(2)
          ?.split("\n")[0];

        resolve(info || null);
      })
      .catch(err => {
        throw err;
      });
  });
}

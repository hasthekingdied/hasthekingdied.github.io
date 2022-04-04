var name = "Elizabeth II";

async function init() {
  // Loading CSS
  $(".loading").css("display", "block");
  $(".check, .date").css("display", "none");
  $("body").removeClass("false").removeClass("true");
  $(".question").addClass("move");

  // Check death
  var deathDate = await getDeathDate(name);
  // Run if dead or not dead
  deathDate ? setDead(deathDate) : setNotDead();
  $(".loading").css("display", "none");
  $(".question").removeClass("move");
}

// If not dead
function setNotDead() {
  $(".answer").text("no 😢");
  $("body").addClass("false");
  $(".check").css("display", "block");
}

// If is dead
function setDead(deathDate) {
  $(".answer").text("YES! 🎉");
  $("body").addClass("true");
  $(".date").text(deathDate).css("display", "block");

  confetti({
    particleCount: 200,
    origin: { x: 0.5, y: 1 },
    scalar: 1.8,
  });
}

// Get death date from Wikipedia article
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

// Credits
function credits() {
  console.log("Made by darcy\nPowered by the Wikipedia API");
}

var name = "Elizabeth II";
var answers = {
  no: [
    "no",
    "no...",
    "Nope.",
    "Nup",
    "NO!",
    "not yet...",
    "No... for now.",
    "Not a chance",
    "Probably not.",
    "You wish!",
    "Nope. Try again tomorrow!",
    "no 😢",
    `No. But perhaps it will occur on:<br /><code>${getFutureDate()}</code>`,
  ],
  yes: [
    "YES! 🎉",
    "🥳 YES! 🥳",
    "🎉 APPARENTLY",
    "🎉🎉 SOURCES SAY YES!!! 🎉🎉",
    "i think so!?!?! 🥳",
    "YES! 🎉 CAN YOU BELIEVE IT?",
  ],
};

async function init() {
  // Loading CSS
  $(".loading").css("display", "block");
  $(".check, .source").css("display", "none");
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
  $(".answer").html(F.randomChoice(answers.no));
  $("body").addClass("no");
  $(".check").css("display", "block");
}

// If is dead
function setDead(deathDate) {
  $(".answer").text(F.randomChoice(answers.yes));
  $("body").addClass("yes");
  $(".date").text(deathDate);
  $(".source").css("display", "block");

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

// Get random date somewhere in the near future
function getFutureDate() {
  return new Date(Date.now() + F.randomInt(2e9, 4e9))
    .toString()
    .split(" ")
    .slice(0, 5)
    .join(" ");
}

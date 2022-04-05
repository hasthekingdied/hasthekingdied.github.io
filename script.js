// We here at hasthequeendied do not advocate for violence towards anyone, including members of the royal family
// This is simply a test of the Wikipedia API

var name = "Elizabeth II";
var answers = {
  no: [
    "no",
    "no...",
    "Nope.",
    "Nup",
    "NO!",
    "not yet...",
    "no? doesn't seem that way",
    "No... for now.",
    "Not a chance",
    "Probably not tbh.",
    "You wish!",
    "Nope. Try again tomorrow!",
    `No. But perhaps it will occur on:<br /><code>${getFutureDate()}</code>`, // Merely a harmless prediction is all!
  ],
  yes: [
    "YES!",
    "YES! Uh oh!",
    "APPARENTLY",
    "SOURCES SAY YES!!!",
    "i think so!?!?!",
    "YES! CAN YOU BELIEVE IT?",
  ],
};

async function init() {
  // Loading CSS
  $(".loading").css("display", "block");
  $(".check, .source").css("display", "none");
  $("body").removeClass("no").removeClass("yes");
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
const logs = {};
function getDeathDate(name) {
  return new Promise(resolve => {
    const now = Date.now();
    logs[now] = {};

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
    fetch(URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(json => {
        logs[now].json = json;
        // Parse data (very unreliable)
        var date = Object.values(json?.query?.pages)?.[0]
          ?.revisions[0]["*"].split("death_date")[1]
          ?.replace(/^ */, "")
          ?.slice(2)
          ?.split("\n")[0];
        logs[now].date = date;

        resolve(date || null);
      })
      .catch(err => {
        throw err;
      });
  });
}

// Get random date somewhere in the near future
function getFutureDate() {
  return new Date(Date.now() + F.randomInt(2e9, 4e9))
    .toString()
    .split(" ")
    .slice(0, 5)
    .join(" ");
}

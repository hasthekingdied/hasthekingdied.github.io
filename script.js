var fullName = "Charles_III";
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
    `No. But perhaps it will occur on:<br /><code>${getFutureDate()}</code>`, // Merely a harmless prediction is all! This is NOT a threat
  ],
  yes: [
    "YES!",
    "YES! Uh oh!",
    "APPARENTLY",
    "SOURCES SAY YES!!!",
    "i think so!?!?!",
    "YES! CAN YOU BELIEVE IT?",
    "Yeah? Goodness.",
    "It looks like it.",
  ],
};

// Start everything
async function init(name = fullName) {
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
  return deathDate;
}

// If not dead
function setNotDead() {
  $(".answer").html(randomChoice(answers.no));
  $("body").addClass("no");
  $(".check").css("display", "block");
}

// If is dead
function setDead(deathDate) {
  $(".answer").text(randomChoice(answers.yes));
  $("body").addClass("yes");
  $(".date").text(new Date(deathDate).toDateString());
  $(".difference").text(getDateDifference(deathDate));
  $(".source").css("display", "block");

  confetti({
    particleCount: 200,
    origin: { x: 0.5, y: 1 },
    scalar: 1.8,
  });
}

// Get difference in date between death date and now, as string
function getDateDifference(date) {
  return parseTime(new Date(Date.now() - date), undefined, (item, i) => {
    if (i < 2) {
      return (
        Math.floor(item.amount).toString() +
        " " +
        (Math.floor(item.amount) === 1 ? item.singular : item.plural)
      );
    }
  });
}

// Get death date from Wikipedia article
function getDeathDate(name, returnStats) {
  return new Promise(resolve => {
    // Fetch Wikipedia API
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
        // Find date in whole article
        var dateString = Object.values(json?.query?.pages)?.[0]
          ?.revisions[0]["*"].split(/death_date\s*=\s*(?!\|)/g)[1]
          // ?.replace(/^ */, "")
          // ?.slice(2)
          ?.split("\n")[0];

        // Parse Wikipedia date format to date string
        var date = null;
        if (dateString) {
          if (dateString?.startsWith("{{") && dateString?.endsWith("}}")) {
            dateString = dateString.slice(0, -2).split("|");
            if (dateString[1]?.includes("=")) {
              dateString = dateString.slice(-6, -3);
            } else {
              dateString = dateString.slice(1, 4);
            }
            dateString =
              dateString[1] + " " + dateString[2] + " " + dateString[0];
          } else {
            dateString = dateString.split(" (")[0];
          }

          date = new Date(dateString).getTime(); // Convert to date code
          // For test function
          if (returnStats) {
            resolve({ name, dateString, date });
            return;
          }
        }

        resolve(date);
      })
      .catch(err => {
        throw err;
      });
  });
}

// Get random date somewhere in the near future
function getFutureDate() {
  return new Date(Date.now() + randomInt(2e9, 4e9))
    .toString()
    .split(" ")
    .slice(0, 5)
    .join(" ");
}

// Test getDeathDate API with other name (Debug)
function debug() {
  $(".debug").text("[debug] - This is not real!!!");
  console.warn(
    "[debug] RUNNING TEST!\nDocument will run as 'Elizabeth II', be warned!",
  );
  //TODO Add test results
  init("Elizabeth II");
  var testNames = [
    "Elvis Presley",
    "Michael Jackson",
    "Betty White",
    "Charles III",
    "Elizabeth II",
    "Elizabeth I",
    "Elon Musk",
    "Dwayne Johnson",
    "Kobe Bryant",
    "Jared Leto",
    "Steve Irwin",
    "Joe Biden",
    "XXXTentacion",
    "Kanye West",
    "Prince (musician)",
    "DaBaby",
    "Ray Liotta",
    "Jerry Seinfeld",
  ];
  for (var i in testNames) {
    (async name => {
      var res = await getDeathDate(testNames[i], true);
      console.log(
        `[debug] '${name}': ${res?.date ? "DEAD" : "alive"}` + "\n   Date:",
        res?.dateString,
        "\n   Code:",
        res?.date,
      );
    })(testNames[i]);
  }
}

//TODO Add comments to below functions

function randomInt(min, max, floor = true) {
  if (min === max) {
    return min;
  }
  if (min > max) {
    throw "Minimum greater than maximum";
  }
  return Math[floor ? "floor" : "round"](Math.random() * (max - min) + min);
}

function randomChoice(array) {
  if (!array) {
    return;
  }
  return array[randomInt(0, array.length - 1)];
}

function parseTime(
  milliseconds,
  join = ", ",
  method = item => {
    return (
      Math.floor(item.amount).toString() +
      " " +
      (Math.floor(item.amount) === 1 ? item.singular : item.plural)
    );
  },
) {
  var units = [
    {
      amount: 1000,
      prefix: "s",
      singular: "second",
      plural: "seconds",
      size: 1,
    },
    {
      amount: 60,
      prefix: "m",
      singular: "minute",
      plural: "minutes",
      size: 2,
    },
    {
      amount: 60,
      prefix: "h",
      singular: "hour",
      plural: "hours",
      size: 3,
    },
    {
      amount: 24,
      prefix: "d",
      singular: "day",
      plural: "days",
      size: 4,
    },
    {
      amount: 7,
      prefix: "w",
      singular: "week",
      plural: "weeks",
      size: 5,
    },
    {
      amount: 4.34524,
      prefix: "M",
      singular: "month",
      plural: "months",
      size: 6,
    },
    {
      amount: 12,
      prefix: "Y",
      singular: "year",
      plural: "years",
      size: 7,
    },
    {
      amount: 10,
      prefix: "D",
      singular: "decade",
      plural: "decades",
      size: 8,
    },
    {
      amount: 10,
      prefix: "C",
      singular: "century",
      plural: "centuries",
      size: 9,
    },
  ];
  var time = [
    {
      amount: milliseconds,
      prefix: "ms",
      singular: "millisecond",
      plural: "millisecond",
      size: 0,
    },
  ];
  for (var i in units) {
    if (time[0].amount >= units[i].amount) {
      if (time[0].amount % units[i].amount) {
        time = [
          {
            ...units[i],
            amount: Math.floor(time[0].amount / units[i].amount),
          },
          {
            ...time[0],
            amount: time[0].amount % units[i].amount,
          },
          ...time.slice(1),
        ];
      } else {
        time = [
          {
            ...units[i],
            amount: Math.floor(time[0].amount / units[i].amount),
          },
          ...time.slice(1),
        ];
      }
    } else {
      break;
    }
  }
  return time
    .map(method)
    .filter(i => i !== undefined)
    .join(join);
}

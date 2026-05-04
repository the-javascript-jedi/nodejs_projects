const DB_DATA = require("../data/db-halo-games");

exports.searchGames = function (req, res) {
  const filter = (req.query.filter || "").trim().toLowerCase();

  let games = DB_DATA.HALO_GAMES;

  if (filter) {
    games = games.filter((gameVal) => {
      const text = (
        gameVal.description +
        " " +
        gameVal.category +
        " " +
        gameVal.longDescription
      ).toLowerCase();

      return text.includes(filter);
    });
  } else {
    games = games.slice(0, 10);
  }

  console.log("FILTER:", filter);
  console.log("RESULT COUNT:", games.length);

  setTimeout(() => {
    res.status(200).json({ gamesData: games });
  }, 1000);
};

const fs = require("fs");
const cheerio = require("cheerio");
const data = require("./data.json");
const axios = require("axios");

const { getInfo } = require("./utils/getInfo");
const axiosRetry = require("axios-retry").default;

const FILES = {
  PAL: "./pal.json",
  NTSC: "./ntsc-u.json",
  JAPAN: "./ntsc-j.json",
};

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
});

const getGames = async (file, u) => {
  const promis = data[u].map(async (game) => {
    let html;
    if (JSON.parse(file).find((g) => g.url === game)) {
      return JSON.parse(file).find((g) => g.url === game);
    }
    try {
      html = await axios(game);
    } catch {
      console.log("Failed at ", game);
      return {};
    }
    const $ = cheerio.load(html.data);

    return getInfo($, game);
  });

  return await Promise.all(promis);
};

(async () => {
  try {
    // const palGames = await getGames(fs.readFileSync(FILES.PAL, "utf-8"), "pal");
    // fs.writeFileSync(FILES.PAL, JSON.stringify(palGames, null, 2));

    // const ntscGames = await getGames(fs.readFileSync(FILES.NTSC, "utf-8"), "u");
    // fs.writeFileSync(FILES.NTSC, JSON.stringify(ntscGames, null, 2));

    const jGames = await getGames(fs.readFileSync(FILES.JAPAN, "utf-8"), "j");
    fs.writeFileSync(FILES.JAPAN, JSON.stringify(jGames, null, 2));
  } catch (e) {
    console.log("OH NO", e);
  }
})();

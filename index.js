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

const getGames = async (file) => {
  const promis = data.pal.map(async (game) => {
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
    const palGames = await getPal(fs.readFileSync(FILES.PAL, "utf-8"));
    fs.writeFileSync(FILES.PAL, JSON.stringify(palGames, null, 2));

    const ntscGames = await getNtsc(fs.readFileSync(FILES.NTSC, "utf-8"));
    fs.writeFileSync(FILES.NTSC, JSON.stringify(ntscGames, null, 2));

    const jGames = await getj(fs.readFileSync(FILES.J, "utf-8"));
    fs.writeFileSync(FILES.J, JSON.stringify(jGames, null, 2));
  } catch (e) {
    console.log("OH NO", e);
  }
})();

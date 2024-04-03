const cheerio = require("cheerio");
const data = require("./data.json");
const axios = require("axios");
var TurndownService = require("turndown");

const main = async () => {
  const html = await axios(data.pal[0]);
  const $ = cheerio.load(html.data);

  const cover = $("#table2")
    .find("td[width='250'] img")
    .attr("src")
    .replace("../../../", "https://psxdatacenter.com/");
  const mainInfo = $("#table4");
  const officialTitle = mainInfo
    .find("tbody tr:nth-child(1) td:last-child")
    .text()
    .trim();
  const commonTitle = mainInfo
    .find("tbody tr:nth-child(2) td:last-child")
    .text()
    .trim();
  const serialNumber = mainInfo
    .find("tbody tr:nth-child(3) td:last-child")
    .text()
    .trim();
  const region = mainInfo
    .find("tbody tr:nth-child(4) td:last-child")
    .text()
    .trim();
  const genre = mainInfo
    .find("tbody tr:nth-child(5) td:nth-child(2)")
    .text()
    .trim();
  const developer = mainInfo
    .find("tbody tr:nth-child(6) td:last-child")
    .text()
    .trim();
  const publisher = mainInfo
    .find("tbody tr:nth-child(7) td:last-child")
    .text()
    .trim();
  const dateReleased = new Date(
    mainInfo.find("tbody tr:nth-child(8) td:last-child").text().trim()
  );
  const description = new TurndownService().turndown(
    $("#table16").find("td").html()
  );
  const screenshots = [...$("#table22 img")].map((e, i) =>
    $(e).attr("src").replace("../../../", "https://psxdatacenter.com/")
  );
  console.log(screenshots);
};

(async () => {
  try {
    const text = await main();
    console.log(text);
  } catch (e) {
    console.log("OH NO", e);
  }
})();

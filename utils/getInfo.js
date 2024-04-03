const TurndownService = require("turndown");
const getTrimmedText = (selector) => selector.text().trim();
const tn = new TurndownService();

const getInfo = ($, url) => {
  const cover = $("#table2")
    .find("td[width='250'] img")
    .attr("src")
    ?.replace("../../../", "https://psxdatacenter.com/");
  const mainInfo = $("#table4");
  const officialTitle = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(1) td:last-child")
  );
  const commonTitle = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(2) td:last-child")
  );
  const serialNumber = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(3) td:last-child")
  );
  const region = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(4) td:last-child")
  );
  const genre = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(5) td:nth-child(2)")
  );
  const developer = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(6) td:last-child")
  );
  const publisher = getTrimmedText(
    mainInfo.find("tbody tr:nth-child(7) td:last-child")
  );
  const dateReleased = new Date(
    mainInfo.find("tbody tr:nth-child(8) td:last-child").text().trim()
  );
  const description = tn.turndown($("#table16").find("td").html() || "");
  const screenshots = [...$("#table22 img")].map((e, i) =>
    $(e).attr("src").replace("../../../", "https://psxdatacenter.com/")
  );
  const features = $("#table19");
  const players = getTrimmedText(
    features.find("tbody tr:nth-child(1) td:last-child")
  );
  const memCardBlocks = getTrimmedText(
    features.find("tbody tr:nth-child(2) td:last-child")
  );
  const controllersCompatible = getTrimmedText(
    features.find("tbody tr:nth-child(3) td:last-child")
  );
  const lightGunCompatible =
    getTrimmedText(features.find("tbody tr:nth-child(4) td:last-child")) ===
    "None"
      ? []
      : getTrimmedText(features.find("tbody tr:nth-child(4) td:last-child"));

  const gameControls = tn.turndown($("#table14a #table16 td").html() || "");
  const cheats = tn.turndown($("#table14a+#table14a #table16 td").html() || "");
  const otherRegions = [...$("#table32 td ul")]
    .map((a) =>
      $(a)
        .find("li")
        .text()
        .split("\t")
        .join("")
        .trim()
        .split("\n")
        .map((a) => a.trim())
    )
    .flat();

  if (!officialTitle) return {};

  return {
    url,
    cover,
    title: officialTitle,
    commonTitle,
    serialNumber,
    region,
    genre,
    developer,
    publisher,
    dateReleased,
    description,
    screenshots,
    players,
    memCardBlocks,
    controllersCompatible,
    lightGunCompatible,
    controls: gameControls,
    cheats,
    otherRegions,
  };
};

module.exports = { getInfo };

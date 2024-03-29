const input = document.getElementById("location-input");
const body = document.body;
const loadingPrompt = document.getElementById("loading-prompt");
const detailsModal = document.getElementById("details-modal");
const loadingPromptH1 = loadingPrompt.querySelector("h1");

input.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    detailsModal.style.display = "none";
    loadingPrompt.style.display = "grid";
    loadingPromptH1.innerText = "Chat-GPT is generating an image...";

    const location = document.getElementById("location-input").value;
    const weatherData = await getWeatherData(location);

    if (weatherData.ok) {
      console.log("success");

      const result = await weatherData.json();
      body.style.backgroundImage = `url(${result.imgUrl})`;
      console.log(result);
      placeValues(result);
      input.value = "";
    } else {
      console.log("failed");
      const result = await weatherData.json();
      console.log(result.message);

      loadingPromptH1.innerText = result.message;
      input.value = "";
    }
  }
});
async function placeValues(value) {
  const result = await value;
  loadingPrompt.style.display = "none";
  detailsModal.style.display = "grid";
  const location = document.getElementById("location");
  const region = document.getElementById("region");
  const country = document.getElementById("country");
  const time = document.getElementById("time-span");
  const timezone = document.getElementById("timezone");
  const fullDate = document.getElementById("full-date");

  const temperature = document.getElementById("temperature-span");
  const condition = document.getElementById("condition");
  const feelsLike = document.getElementById("feels-like-span");
  const windSpeed = document.getElementById("wind-speed-span");
  const windDegree = document.getElementById("wind-degree-span");
  const windDirection = document.getElementById("wind-direction-span");
  const pressure = document.getElementById("pressure-span");
  const precipitation = document.getElementById("precipitation-span");
  const humidity = document.getElementById("humidity-span");
  const UVIndex = document.getElementById("uv-index-span");
  const gust = document.getElementById("gust-span");
  const lastUpdated = document.getElementById("last-updated-span");

  location.innerText = result.data.location.name;
  region.innerText = result.data.location.region;
  country.innerText = result.data.location.country;

  temperature.innerText = result.data.current.temp_c;
  condition.innerText = result.data.current.condition.text;
  feelsLike.innerText = result.data.current.feelslike_c;

  const date = parseDate(result.data.location.localtime);
  time.innerText = date.time;
  timezone.innerText = date.meridiem;
  fullDate.innerText = `${date.day}, ${date.month} ${date.date}, ${date.year}`;

  windSpeed.innerText = result.data.current.wind_mph;
  windDegree.innerText = result.data.current.wind_degree;
  windDirection.innerText = result.data.current.wind_dir;
  pressure.innerText = result.data.current.pressure_mb;
  precipitation.innerText = result.data.current.precip_mm;
  humidity.innerText = result.data.current.humidity;
  UVIndex.innerText = result.data.current.uv;
  gust.innerText = result.data.current.gust_mph;
  lastUpdated.innerText = result.data.current.last_updated;
}
function parseDate(dateString) {
  const originalDateStr = dateString;

  // Parse the date string to a Date object
  const originalDate = new Date(originalDateStr);

  // Format the Date object with the day of the week
  const formattedDate = originalDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const nocommaDateString = formattedDate.split(",").join("");
  const finalDateString = nocommaDateString.split(" ");

  const finalDateStringObject = {
    day: finalDateString[0],
    month: finalDateString[1],
    date: finalDateString[2],
    year: finalDateString[3],
    time: finalDateString[5],
    meridiem: finalDateString[6],
  };
  return finalDateStringObject;
}
// function parseDate(dateString) {
//   let formattedDateString = dateString.replace(/-/g, "/") + " UTC";
//   console.log(" formatted date string", formattedDateString);
//   let parsedDate = Date.parse(formattedDateString);
//   console.log("parsed date", parsedDate);
//   let parsedDateObject = new Date(parsedDate);
//   console.log(" parsed date object", parsedDateObject);

//   const stringDate = parsedDateObject.toString();

//   const stringDateObject = stringDate.split(" ");

//   const dateObject = {
//     day: stringDateObject[0],
//     month: stringDateObject[1],
//     date: stringDateObject[2],
//     year: stringDateObject[3],
//     time: stringDateObject[4],
//     timeZone: stringDateObject[5],

//     countryTime:
//       stringDateObject[6] +
//       " " +
//       stringDateObject[7] +
//       " " +
//       stringDateObject[8],
//   };
//   console.log("date object", dateObject);

//   return dateObject;
// }
async function getWeatherData(location) {
  if (location.length != 0) {
    const response = await fetch("/home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: location,
      }),
    });
    return response;
  }
  return;
}

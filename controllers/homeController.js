import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAIApi from "openai";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getHome = async (req, res) => {
  const homePath = join(__dirname, "../public/html/home.html");
  res.sendFile(homePath);
};
export const postHome = async (req, res) => {
  const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.Weather_API}&q=${req.body.location}`;

  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();

    const prompt = await processPromptForModel(data);
    console.log(prompt);
    const imgUrl = await getImage(prompt);
    //const imgUrl = "Image Url";
    res.status(200).json({ data: data, imgUrl: imgUrl });
  } else {
    const data = await response.json();
    res.status(400).json(data.error);
  }
};
async function processPromptForModel(data) {
  const localtime = data.location.localtime.split(" ");
  const daytime = data.current.is_day === 1 ? "daytime" : "nighttime";
  const modelPrompt = `can you create an image for me? I am using the image you will generate for weather forecasting. Here are the details for the image: It is ${daytime} Location: ${
    data.location.region + " " + data.location.country
  }, Time: ${localtime[1]}, Temperature in degrees Celsius: ${
    data.current.temp_c
  }, Condition: ${data.current.condition.text}`;

  return modelPrompt;
}
async function getImage(prompt) {
  const openai = new OpenAIApi({
    apiKey: process.env.OpenAI_API,
  });
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
  });
  return response.data[0].url;
}

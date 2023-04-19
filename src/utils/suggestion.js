import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const suggestion = async (selectedTags) => {
  const prompt = ` The following is a conversation with an AI assistant.

  Human : give me only one json containing atmost four elements of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude and they should be in Decimal Degree Notation ,price : integer) of best mountains , oceans , valleys in the world with complete address , name , description and coordinatates.
  AI : [
    {
      "name": "Mount Everest",
      "location": "Nepal",
      "description": "Mount Everest is the highest mountain in the world, with a peak that reaches 29,029 feet (8,848 meters) above sea level.",
      "coordinates": [27.9881, 86.9253],
      "price": 5000
    },
    {
      "name": "Great Barrier Reef",
      "location": "Australia",
      "description": "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometers (1,400 mi).",
      "coordinates": [-18.2861, 147.7],
      "price": 7000
    },
    {
      "name": "Grand Canyon",
      "location": "Arizona, United States",
      "description": "The Grand Canyon is a steep-sided canyon carved by the Colorado River in the state of Arizona in the United States. It is 277 miles (446 km) long, up to 18 miles (29 km) wide and attains a depth of over a mile (6,093 feet or 1,857 meters).",
      "coordinates": [36.1069, -112.1121],
      "price": 3000
    },
    {
      "name": "Meteora",
      "location": "Greece",
      "description": "Meteora is a complex of Eastern Orthodox monasteries built on natural sandstone pillars in central Greece. The six monasteries are built on immense natural pillars and hill-like rounded boulders that dominate the local area.",
      "coordinates": [39.7128, 21.6306],
      "price": 6000
    }
  ]  
  Human  : give me only one json containing atmost four elements of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude and they should be in Decimal Degree Notation ,price : integer) of best ${selectedTags[0]} , ${selectedTags[1]} , ${selectedTags[2]} in the world with complete address , name , description and coordinatates.
  AI :  `

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: [" Human:", " AI:"],
  })
  const finalResponse = JSON.parse(response.data.choices[0].text)
  return finalResponse
}

export default suggestion

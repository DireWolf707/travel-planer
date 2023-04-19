import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const planner = async ({ destination, days, budget, familyMembers, children, currentLocation }) => {
  const prompt = ` The following is a conversation with an AI assistant.
  Human : give me a json of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude and they should be in Decimal Degree Notation ,price : integer) of some 4 day vacation of Seattle , Washington , USA  for a family of 4 with 2 children coming from Kolkata , India with the budget of 4000 of their native currency with complete address , name , description and coordinatates.
  AI : [
    {
      "name": "Seattle City Tour",
      "location": "Seattle, Washington, USA",
      "description": "A 4-day tour of Seattle, including visits to the Space Needle, Pike Place Market, and the Seattle Aquarium. Enjoy the sights and sounds of this vibrant city!",
      "coordinates": [ 47.6062, -122.3321 ],
      "price": 4000
    }"
    {
      "name": "Mount Rainier Tour",
      "location": "Mount Rainier, Washington, USA",
      "description": "A 4-day tour of Mount Rainier, including visits to the Paradise Visitor Center, the Nisqually Vista Trail, and the Sunrise Visitor Center. Enjoy the breathtaking views of this majestic mountain!",
      "coordinates": [ 46.8523, -121.7603 ],
      "price": 400"
    },
    {
      "name": "Olympic National Park Tour",
      "location": "Olympic National Park, Washington, USA",
      "description": "A 4-day tour of Olympic National Park, including visits to the Hoh Rainforest, the Sol Duc Hot Springs, and the Hurricane Ridge Visitor Center. Enjoy the beauty of this stunning national park!",
      "coordinates": [ 47.8025, -123.6053 ],
      "price": 4000
    },
    {
    "name": "San Juan Islands Tour",
    "location": "San Juan Islands, Washington, USA",
    "description": "A 4-day tour of the San Juan Islands, including visits to Orcas Island, Lopez Island, and San Juan Island. Enjoy the stunning scenery and wildlife of this beautiful archipelago!",
    "coordinates": [ 48.5667, -123.0833 ],
    "price": 4000
    }
  ]
  Human  : again , give me a json of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude and they should be in Decimal Degree Notation ,price : integer) of some ${days} day vacation of ${destination}  for a family of ${familyMembers} with ${children} children coming from ${currentLocation} with the budget of ${budget} of their native currency with complete address , name , description and coordinatates .
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

export default planner

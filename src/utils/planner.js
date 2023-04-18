import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const planner = async ({ destination, days, budget, familyMembers, children, currentLocation }) => {
  const prompt = ` The following is a conversation with an AI assistant.

  Human : give me a json of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude ,price : integer) of some 4 day vacation of Tamil Nadu , India  for a family of 6 with 2 children coming from Kolkata , India with the budget of 4000 of their native currency with complete address , name , description and coordinatates.
  AI : [
    {
      "name": "Chennai Beach Tour",
      "location": "Chennai, Tamil Nadu, India",
      "description": "A 4-day tour of Chennai's beaches, including visits to Marina Beach, Elliot's Beach, and Covelong Beach. Enjoy the sun, sand, and surf of the Bay of Bengal!",
      "coordinates": [ 13.0827, 80.2707 ],
      "price": 4000
    },
    {
      "name": "Kanchipuram Tour",
      "location": 'Kanchipuram, Tamil Nadu, India",
      "description": "A 4-day tour of Kanchipuram, including visits to the Kailasanathar Temple, Ekambareswarar Temple, and Varadaraja Perumal Temple. Enjoy the rich culture and history of this ancient city!",
      "coordinates": [ 12.8353, 79.7037 ],
      "price": 4000
    },"
    {
      "name": "Mahabalipuram Tour",
      "location": "Mahabalipuram, Tamil Nadu, India",
      "description": "A 4-day tour of Mahabalipuram, including visits to the Shore Temple, Arjuna's Penance, and the Five Rathas. Enjoy the beautiful architecture and sculptures of this UNESCO World Heritage Site!",
      "coordinates": [ 12.6204, 80.1856 ],
      "price": 4000
    },
    {
      "name": "Pondicherry Tour",
      "location": "Pondicherry, Tamil Nadu, India",
      "description": "A 4-day tour of Pondicherry, including visits to the Aurobindo Ashram, the French Quarter, and the Promenade Beach. Enjoy the unique blend of French and Indian culture in this former French colony!",
      "coordinates": [ 11.93, 79.83 ],
      "price": 4000
    }
  ]
  Human  : again , give me a json of format (name : string , location: string ,description : string, coordinates : array of latitude and longitude ,price : integer) of some ${days} day vacation of ${destination}  for a family of ${familyMembers} with ${children} children comming from ${currentLocation} with the budget of ${budget} of their native currency with complete address , name , description and coordinatates .
  AI :  `

  let response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: [" Human:", " AI:"],
  })

  let finalResponse = JSON.parse(response.data.choices[0].text)
  return finalResponse
}

export default planner

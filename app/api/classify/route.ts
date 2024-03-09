import OpenAI from 'openai';
import {OpenAIStream, StreamingTextResponse, experimental_StreamData} from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const {prompt} = await req.json();

  // Wrap the user input with an additional prompt for FATCA classification
  const instruction = `
    Dear ChatGPT,

    To ensure compliance with FATCA regulations, I require your expertise in classifying an entity based on provided details. Your insights are crucial for identifying the correct regulatory requirements. Please respond strictly in JSON format.

    1. Classification: Begin by stating your classification of the entity according to FATCA.

    2. Confidence Rating: Next, provide an estimate of your confidence in this classification, expressed as a percentage.

    3. Rationale for Confidence Rating: Explain why you've chosen this confidence rating.

    4. Rationale for Classification: Detail your reasoning behind the classification.

    5. Additional Information Required: If your confidence is below 95%, list all the questions you need answered to potentially increase your confidence above 95%.

    Please avoid saying things like "FATCA is complex". Instead, word it like a professional legal styled response.

    Your clear and sophisticated analysis is greatly appreciated.

    Thank you.

    Here's the relevant information about the entity: \n\n${prompt}`;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{role: 'user', content: instruction + prompt}],
    response_format: {type: 'json_object'},
    stream: true,
  });

  // optional: use stream data
  const data = new experimental_StreamData();

  data.append({test: 'value'});

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });

  // Respond with the stream
  return new StreamingTextResponse(stream, {}, data);
}

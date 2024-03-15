import OpenAI from 'openai';
import {OpenAIStream, StreamingTextResponse, experimental_StreamData} from 'ai';
import { buildInstructionSet } from './buildInstructionSet';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  // Set CORS headers
  // res.setHeader() sets response headers. 'Access-Control-Allow-Origin' header allows all domains to access your API
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // Extract the `prompt` from the body of the request
  const {prompt} = await req.json();

  // Wrap the user input with an additional prompt for FATCA classification
  const instruction = buildInstructionSet(prompt);

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



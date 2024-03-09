'use client';

import { useState } from 'react';
//import OpenAI from 'openai';

import { useCompletion } from 'ai/react';

import { ClassifyPage } from '@/devlink';

import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
});

// Create an OpenAI API client (that's edge friendly!)
// const openai = new OpenAI({
//   dangerouslyAllowBrowser: true
// });


const loadingMessages = [
  "Reviewing provided information...",

  "Considering all relevant international regulations...",

  "Delving into the FATCA/CRS regulations...",

  "Parsing intricate details of compliance laws...",

  "Cross-referencing entity data with current compliance standards...",

  "Comparing entity information against up-to-date regulatory requirements...",

  "Evaluating entity structure...",

  "Considering the latest amendments to the regulations...",

  "Developing classification rationale...",

  "Further analysing financial activities and relationships...",

  "Preparing actionable insights and recommendations...",

  "Finalizing report to provide bespoke compliance roadmap..."
]

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default function FATCAForm() {
  const [loadingMessageId, setLoadingMessageId] = useState(0)
  // const [isProcessing, setIsProcessing] = useState(false)

  const [classification, setClassification] = useState('');
  const [confidenceRating, setConfidenceRating] = useState('');
  const [rationaleForConfidenceRating, setRationaleForConfidenceRating] = useState('');
  const [rationaleForClassification, setRationaleForClassification] = useState('');
  const [additionalInformationRequired, setAdditionalInformationRequired] = useState('');

  const { completion, input, handleInputChange, handleSubmit, error, data, isLoading } = useCompletion({
    api: '/api/classify',
  });

  if (isLoading) {

    if (loadingMessageId === 0) {
      const loadingMsgsInterval = setInterval(() => {
        setLoadingMessageId((oldCount) => oldCount + 1)
      }, 1000);

      if (loadingMessageId >= loadingMessages.length) clearInterval(loadingMsgsInterval)
    }

    try {
      // Attempt to extract and update variables with complete fields as they become available  --  // ({ accumulatedData } =
      extractFields(completion)
    } catch (error) {
      // Handle JSON parsing errors, which are expected for partial data
      // You might not need to do anything here if errors are solely due to partial JSON
      console.error('Parsing error, possibly due to partial data. Waiting for more data...');
    }
    console.log(loadingMessageId, " - inside", loadingMessages.length)

  } else {
    if (loadingMessageId !== 0) setLoadingMessageId(0)
  }

  const submitUserInput = () => {
    console.log("form submission started")
    // setIsProcessing(true);
  }

  function extractFields(data: string) {

    // Function to find and extract a field's value from the data string
    const findAndExtractField = (fieldName: string, dataString: string) => {
      // Regex pattern to match the field name and its complete value, regardless of type
      // This pattern captures:
      // - Quoted field names
      // - Followed by optional spaces, a colon, and optional spaces
      // - The field value, which can be a quoted string, number, object, array, true, false, or null
      const regexPattern = new RegExp(`"${fieldName}"\\s*:\\s*((".*?"|\\d+(\\.\\d+)?|true|false|null|\\[.*?\\]|\\{.*?\\}))\\s*(,|}$)`, 's');
      const match = regexPattern.exec(dataString);

      if (match && match[1]) {
        // Extracted value
        let value = match[1].trim();

        // Attempt to parse the extracted value to handle strings, numbers, booleans, nulls, arrays, and objects
        try {
          value = JSON.parse(value);
        } catch (e) {
          // If parsing fails, it could be due to malformed JSON or incomplete streaming. Since we're focusing on complete data, this case should be rare.
          console.error('Failed to parse field value:', e);
          return { value: null, newData: dataString };
        }

        // Remove the matched portion from the data string to avoid reprocessing
        const newData = dataString.substring(0, match.index) + dataString.substring(match.index + match[0].length);

        return { value, newData };
      }

      // If no complete field is found, return null value and original data
      return { value: null, newData: dataString };
    }

    // Extract fields
    let result;

    if (classification === '') {
      result = findAndExtractField("Classification", data);
      if (result.value !== null) {
        setClassification(result.value)
        data = result.newData;
      }
    }

    if (confidenceRating === '') {
      result = findAndExtractField("Confidence Rating", data);
      if (result.value !== null) {
        setConfidenceRating(result.value)
        data = result.newData;
      }
    }

    if (rationaleForConfidenceRating === '') {
      result = findAndExtractField("Rationale for Confidence Rating", data);
      if (result.value !== null) {
        setRationaleForConfidenceRating(result.value)
        data = result.newData;
      }
    }

    if (rationaleForClassification === '') {
      result = findAndExtractField("Rationale for Classification", data);
      if (result.value !== null) {
        setRationaleForClassification(result.value)
        data = result.newData;
      }
    }

    if (additionalInformationRequired === '') {
      result = findAndExtractField("Additional Information Required", data);
      if (result.value !== null) {
        setAdditionalInformationRequired(result.value)
        data = result.newData;
      }
    }

    // Return the modified data string
    return { accumulatedData: data };

  }

  return (
    <div className={libreBaskerville.className}>
      {/* <p>{completion}</p>
      <div>
        <h3>FATCA Classification:</h3>
        <p>{classification}</p>
        <p>{confidenceRating}</p>
        <p>{rationaleForConfidenceRating}</p>
        <p>{rationaleForClassification}</p>
        <p>{additionalInformationRequired}</p>
      </div> */}

      <ClassifyPage
        classification={classification} // || loadingMessageId === 0 && classification === '' ? "" : "Processing classification..."}
        confidenceRating={confidenceRating} //  || loadingMessageId === 0 && confidenceRating === '' ? "" : "Calculating confidence rating..."}
        rationaleForConfidenceRating={rationaleForConfidenceRating} //  || loadingMessageId === 0 && rationaleForConfidenceRating === '' ? "" : "Detailing Rationale..."}
        rationaleForClassification={rationaleForClassification} //  || loadingMessageId === 0 && rationaleForClassification === '' ? "" : 'Mapping reasoning...'}
        additionalInformationRequired={additionalInformationRequired} //  || loadingMessageId === 0 && additionalInformationRequired === '' ? "" : "Determining best next actions"}
        userInputSection={
          <>
            {loadingMessageId > 0 && loadingMessageId <= 14  && (
              <div className="h-2/5 w-5/6 p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse">
                <p>{loadingMessages[loadingMessageId]}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <textarea
                id="entityInfo"
                value={input}
                // value={entityInfo}
                // ref={textareaRef} // Attach the ref to the textarea
                // disabled={status !== 'awaiting_message'}
                className="h-3/6 w-11/12 p-2 m-5 border border-gray-300 rounded shadow-xl"
                placeholder="Please copy and paste all your entity information here to receive your FATCA classification..."
                onChange={handleInputChange}
                // onChange={(e) => setEntityInfo(e.target.value)}
                rows={8}
                required
                aria-multiline
              // multiple
              />
              <button
                className="p-2 mr-5 bg-black text-white rounded-lg float-right"
                // onClick={focusTextarea}
                onClick={() => submitUserInput()}
                type="submit"
              >
                Classify the Entity
              </button>
            </form>
          </>

        }
      />


      {/* <form onSubmit={handleSubmit}>
        <label htmlFor="entityInfo">Enter FATCA related information about an entity:</label>
        <textarea
          id="entityInfo"
          value={entityInfo}
          onChange={(e) => setEntityInfo(e.target.value)}
          rows={5}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form> */}

    </div>
  );
}



// async function fetchAndProcessStream(prompt: string) {

// try {
//   const stream = await openai.chat.completions.create({
//     model: 'gpt-4-turbo-preview',
//     messages: [{ role: 'user', content: prompt }],
//     response_format: { "type": "json_object" },
//     stream: true,
//   });

// for await (const chunk of stream) {
//   const chunkContent = chunk.choices[0]?.delta?.content || '';
//   //console.log(chunkContent);
//   accumulatedData += chunkContent;

//   try {
//     // Attempt to extract and update variables with complete fields as they become available

//     // ({ accumulatedData } =
//     extractFields(accumulatedData)

//   } catch (error) {
//     // Handle JSON parsing errors, which are expected for partial data
//     // You might not need to do anything here if errors are solely due to partial JSON
//     console.error('Parsing error, possibly due to partial data. Waiting for more data...');
//   }
// }

// Once streaming is complete, or as data is processed, you can use the variables as needed

// console.log(accumulatedData)

// console.log(
//   'Classification:', classification,
//   'Confidence Rating:', confidenceRating,
//   'Rationale for Confidence Rating:', rationaleForConfidenceRating,
//   'Rationale for Classification:', rationaleForClassification,
//   'Additional Information Required:', additionalInformationRequired
// )

// } catch (error) {
//   console.error('Error with streaming:', error);
// }

// }
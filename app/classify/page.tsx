'use client';

import { FormEvent, useState } from 'react';
//import OpenAI from 'openai';

import { useCompletion } from 'ai/react';

import { ClassifyPage } from '@/devlink';

import { Libre_Baskerville } from 'next/font/google';
import { loadingMessages } from './loadingMessages';
import { findAndExtractField } from './findAndExtractField';

import QuestionAnswerComponent from '@/app/classify/QuestionAnswerComponent';

// import { additionalInfoResponseBlock } from './additionalInfoResponseBlock';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default function FATCAForm() {
  const [loadingMessageId, setLoadingMessageId] = useState(0)
  // const [isProcessing, setIsProcessing] = useState(false)

  const [classification, setClassification] = useState('');
  const [confidenceRating, setConfidenceRating] = useState('');
  const [rationaleForConfidenceRating, setRationaleForConfidenceRating] = useState('');
  const [rationaleForClassification, setRationaleForClassification] = useState('');
  const [additionalInformationRequired, setAdditionalInformationRequired] = useState<string[]>([]
    // [
    //   "Please provide detailed information on the specific financial activities conducted by the company.",
    //   "Clarify the legal structure and the jurisdiction of incorporation or establishment of the entity.",
    //   "Detail the ownership structure to assess potential US person control or significant ownership.",
    //   "Specify if the entity accepts deposits in the course of a banking or similar business.",
    //   "Indicate whether the entity holds financial assets for the account of others as a substantial portion of its business.",
    //   "Confirm if the entity is engaged primarily in the business of investing, reinvesting, or trading in securities, partnership interests, commodities, or any related interests.",
    //   "Information regarding any existing FATCA classifications or certifications the entity might have previously obtained."
    // ]
  );

  // Initialize state to store answers. It's an object with question as key and answer as value
  // const [answers, setAnswers] = useState({});
  const [answers, setAnswers] = useState<{ [question: string]: string }>({});

  const [previousSubmission, setPreviousSubmission] = useState('')

  // const inputRef = useRef(null)

  const { completion, input, setInput, handleInputChange, handleSubmit, error, data, isLoading } = useCompletion({
    api: '/api/classify',
  });

  let loadingMsgsInterval

  if (isLoading) {

    if (loadingMessageId === 0) {
      loadingMsgsInterval = setInterval(() => {
        setLoadingMessageId((oldCount) => oldCount + 1)
      }, 1300);

      if (loadingMessageId >= loadingMessages.length) clearInterval(loadingMsgsInterval)
    }

    try {
      // Attempt to extract and update variables with complete fields as they become available  --  // ({ accumulatedData } =
      extractFields(completion)
    } catch (error) {
      // Handle JSON parsing errors, which are expected for partial data
      // You might not need to do anything here if errors are solely due to partial JSON
      console.error('Parsing error, possibly due to partial data. Retrying...');
    }



  } else {
    clearInterval(loadingMsgsInterval)
    if (loadingMessageId !== 0) setLoadingMessageId(0)
  }

  const submitUserInput = () => {
    // console.log("form submission started")
  }

  function extractFields(data: string) {

    // Function to find and extract a field's value from the data string
    // Extract fields
    let result;

    if (classification === '') {
      result = findAndExtractField("Classification", data);
      if (result.value !== null) {
        setClassification(JSON.parse(result.value))
        data = result.newData;
      }
    }

    if (confidenceRating === '') {
      result = findAndExtractField("Confidence Rating", data);
      if (result.value !== null) {
        setConfidenceRating(JSON.parse(result.value))
        data = result.newData;
      }
    }

    if (rationaleForConfidenceRating === '') {
      result = findAndExtractField("Rationale for Confidence Rating", data);
      if (result.value !== null) {
        setRationaleForConfidenceRating(JSON.parse(result.value))
        data = result.newData;
      }
    }

    if (rationaleForClassification === '') {
      result = findAndExtractField("Rationale for Classification", data);
      if (result.value !== null) {
        setRationaleForClassification(JSON.parse(result.value))
        data = result.newData;
      }
    }

    if (additionalInformationRequired.length === 0) {
      result = findAndExtractField("Additional Information Required", data);
      if (result.value !== null) {
        let questions: Array<string> = []
        // Attempt to parse the extracted value to handle strings, numbers, booleans, nulls, arrays, and objects
        try {
          questions = JSON.parse(result.value);
          console.log(result.value, ' < value 1 ... and value type = ', typeof result.value)
        } catch (e) {
          // If parsing fails, it could be due to malformed JSON or incomplete streaming. Since we're focusing on complete data, this case should be rare.
          console.error('Failed to parse field value:', e);
        }

        setAdditionalInformationRequired(questions) // || JSON.parse(result.value) || result.value.split(",")
        // data = result.newData;
      }
    }

    return true
  }

  // Handle changing of any answer
  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [question]: answer,
    }));
    setInput(previousSubmission + ' \n \n Further Information: ' + JSON.stringify(answers))
  };

  // Example function to submit answers
  const handleNewSubmit = (event: FormEvent<HTMLFormElement>) => {

    handleSubmit(event)
    setPreviousSubmission(input)

    // Reset the state for the results ready for new results
    setClassification('')
    setConfidenceRating('')
    setRationaleForConfidenceRating('')
    setRationaleForClassification('')
    setAdditionalInformationRequired([])

  };

  return (
    <div className={libreBaskerville.className}>
      {/* <p>{JSON.stringify(answers)}</p>
      <p>{previousSubmission}</p> */}
      <ClassifyPage
        classification={classification}  // isLoading && classification === '' ? classification : "Determining classification..."}
        confidenceRating={confidenceRating} //  || loadingMessageId === 0 && confidenceRating === '' ? "" : "Calculating confidence rating..."}
        rationaleForConfidenceRating={rationaleForConfidenceRating} //  || loadingMessageId === 0 && rationaleForConfidenceRating === '' ? "" : "Detailing Rationale..."}
        rationaleForClassification={rationaleForClassification} //  || loadingMessageId === 0 && rationaleForClassification === '' ? "" : 'Mapping reasoning...'}
        additionalInformationRequired={
          <>
            {/* {additionalInformationRequired.map((requiredAction, index) => <QuestionAnswerComponent question={requiredAction} key={index} />)} */}

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission behaviour
              handleNewSubmit(e);
            }}>
              {additionalInformationRequired.map((question, index) => (
                <div key={index}>
                  <QuestionAnswerComponent
                    question={question}
                    answer={answers[question]}
                    onAnswerChange={(e) => handleAnswerChange(question, e.target.value)}
                  />
                </div>
              ))}
              {/* <button type="submit">Submit Answers</button> */}
            </form>

          </>
        } //  || loadingMessageId === 0 && additionalInformationRequired === '' ? "" : "Determining best next actions"}
        userInputSection={
          <div style={{ paddingBottom: 100 }}>

            {loadingMessageId > 0 && loadingMessageId <= 14 && (
              <div style={{ width: '96%' }} className="h-2/5 p-2 m-5 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse">
                <p>{loadingMessages[loadingMessageId]}</p>
              </div>
            )}

            <form onSubmit={(e) => {handleNewSubmit(e)}}>
              {
                // classification === '' || true &&
                <textarea
                  // ref="inputRef"
                  id="entityInfo"
                  value={input}
                  // value={entityInfo}
                  // ref={textareaRef} // Attach the ref to the textarea
                  // disabled={status !== 'awaiting_message'}
                  hidden={previousSubmission !== ''}
                  style={{ width: '96%' }}
                  className="h-3/6 p-2 m-5 border border-gray-300 rounded shadow-xl"
                  placeholder="Please copy and paste all your entity information here to receive your FATCA classification..."
                  onChange={handleInputChange}
                  // onChange={(e) => setEntityInfo(e.target.value)}
                  rows={8}
                  required
                  aria-multiline
                // multiple
                />
              }
              <button
                className="p-2 mr-5 bg-black text-white rounded-lg float-right"
                // onClick={focusTextarea}
                onClick={() => submitUserInput()}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." :
                  previousSubmission === '' ?
                    "Classify the Entity" : "Reclassify the Entity"}
              </button>
            </form>
          </div>

        }
      />
    </div>
  );
}

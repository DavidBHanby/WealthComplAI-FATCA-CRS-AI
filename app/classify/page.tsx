'use client';

import { FormEvent, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, useEffect, useRef, useState } from 'react';
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
  const [answers, setAnswers] = useState({});

  const [previousSubmission, setPreviousSubmission] = useState('')

  // const inputRef = useRef(null)

  const { completion, input, setInput, handleInputChange, handleSubmit, error, data, isLoading } = useCompletion({
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
      console.error('Parsing error, possibly due to partial data. Retrying...');
    }

  } else {
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

    if (additionalInformationRequired.length === 0) {
      result = findAndExtractField("Additional Information Required", data);
      if (result.value !== null) {
        // console.log(result.value, ' << raw result ')
        // const parsed = JSON.parse(result.value.replace(/'/g, '"'));
        // if (typeof parsed === "object") {
        //   console.log(parsed, ' << parsed ... and is object ')
        // }
        // const parsedValue = JSON.parse(result.value)
        // console.log(parsedValue, ' << parsedValue')

        // const reset = result.value

        setAdditionalInformationRequired(result.value) // || JSON.parse(result.value) || result.value.split(",")
        // data = result.newData;
      }
    }

    return true
  }

  // useEffect(() => {
  //   const test = JSON.parse(`[
  //     "What is the primary business activity of the company?",
  //     "In which country is the company incorporated or organized?",
  //     "Does the company hold financial accounts or financial assets for others?",
  //     "Is the company engaged in the business of banking or investments?",
  //     "What is the ownership structure of the company?",
  //     "Does the company receive payments from U.S. sources?",
  //     "Is the company already registered with the IRS for FATCA compliance, and if so, what is its GIIN (Global Intermediary Identification Number)?"
  //   ]`)

  //   setAdditionalInformationRequired(test)
  // }, []);



  // Handle changing of any answer
  const handleAnswerChange = (question: any, answer: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [question]: answer,
    }));

    setInput(previousSubmission + ' \n \n Further Information: ' + JSON.stringify(answers))

  };

  // Example function to submit answers
  const handleNewSubmit = (event: FormEvent<HTMLFormElement> | undefined) => {
    // Here you could send `answers` to your API
    // console.log('Submitting additional information:', answers);

    // console.log(event, ' << event')

    // console.log(input, ' << input')



    handleSubmit(event)

    const value = event?.target

    // console.log(value, ' << value')

    setPreviousSubmission(input)

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
        classification={classification} // || loadingMessageId === 0 && classification === '' ? "" : "Processing classification..."}
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
          <>
            {loadingMessageId > 0 && loadingMessageId <= 14 && (
              <div className="h-2/5 w-5/6 p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse">
                <p>{loadingMessages[loadingMessageId]}</p>
              </div>
            )}

            <form onSubmit={(e) => {              handleNewSubmit(e)            }}>
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
              >
                {classification === '' ? "Classify the Entity" : "Reclassify the Entity"}
              </button>
            </form>
          </>

        }
      />

    </div>
  );
}

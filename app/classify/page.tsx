'use client';

import { Message, experimental_useAssistant as useAssistant } from 'ai/react';
import { useEffect, useRef, useState } from 'react';

import Markdown from 'marked-react';

import { Libre_Baskerville } from 'next/font/google';


import { HomePage } from '@/devlink';



const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
});

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'purple',
  function: 'blue',
  tool: 'green',
  assistant: 'black',
  data: 'orange',
};

const loadingMessages = [
  "Reviewing provided information...",

  "Considering all relevant international regulations...",

  "Let's ensure you're covered everywhere.",

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

export default function Chat() {
  const [loadingMessageId, setLoadingMessageId] = useState(0)

  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: '/api/assistant',
    });

  // When status changes to accepting messages, focus the input:
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Create a ref using useRef
  useEffect(() => {
    if (status === 'awaiting_message') {
      textareaRef.current?.focus();
    }
  }, [status]);

  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const showLoadingMessages = () => {
    const id = setInterval(() => setLoadingMessageId((oldCount) => oldCount + 1), 1500);
    console.log(loadingMessageId, " - inside", loadingMessages.length)

    return () => {
      clearInterval(id);
    };
  }

  // useEffect(() => {
  //   const id = setInterval(() => setLoadingMessageId((oldCount) => oldCount + 1), 1500);
  //   console.log(loadingMessageId, " - inside", loadingMessages.length)

  //   return () => {
  //     clearInterval(id);
  //   };
  // }, []);

  messages.map((m: Message) => (console.log(m.content)))

  return (
    <div className={"flex flex-col w-5/6 mx-auto stretch text-sm " + libreBaskerville.className}>
      {error != null && (
        <div className="relative bg-red-500 text-white px-6 py-4 rounded-md">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      {messages.map((m: Message) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
          style={{ color: roleToColorMap[m.role] }}
        >
          <strong>{`${m.role === "assistant" ? "WealthComplAI" : m.role} `}</strong>
          {m.role !== 'data' && <Markdown value={m.content.replace(":", "")} />}
          {m.role === 'data' && (
            <>
              {(m.data as any).description}
              <br />
              <pre className={'bg-gray-200'}>
                <Markdown value={JSON.stringify(m.data, null, 2)} />
              </pre>
            </>
          )}
          <br />
          <br />
        </div>
      ))}

      {status === 'in_progress' && (
        <div className="h-2/5 w-5/6 p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse">
          <p>{loadingMessages[loadingMessageId]}</p>
        </div>
      )}

      <br />

      <form onSubmit={submitMessage}>
        <textarea
          ref={textareaRef} // Attach the ref to the textarea
          disabled={status !== 'awaiting_message'}
          className="fixed bottom-0 w-5/6 h-1/6 p-2 mb-20 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Please copy and paste all your entity information here to receive your FATCA/CRS classification..."
          onChange={handleInputChange}
          aria-multiline
          onSubmit={showLoadingMessages}

        // multiple
        />
        <button
          className="fixed bottom-10 bg-black text-white"
          onClick={focusTextarea}
        >
          Classify the Entity
        </button>
      </form>
    </div>
  );
}

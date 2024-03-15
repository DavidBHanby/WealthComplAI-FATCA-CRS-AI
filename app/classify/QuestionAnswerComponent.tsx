import React from 'react';

// CSS styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  questionBox: {
    backgroundColor: '#f0faff', // very pale blue
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // light shadow
    borderRadius: '8px', // rounded corners
    width: '50%',
    padding: '17px',
    marginRight: '20px', // ensures space between the boxes
  },
  textarea: {
    width: '50%',
    minHeight: '100%',
    padding: '7px',
    borderRadius: '5px', // slightly rounded corners for the input field
    border: '1px solid #ccc', // subtle border
    outline: 'none', // removes the default focus outline
    ':focus': {
      boxShadow: '0px 0px 2px blue', // adds a focus effect
    },
  },
};

// Define the props for the component using an interfacev
interface QuestionAnswerComponentProps {
  question: string;
  answer: string;
  onAnswerChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const QuestionAnswerComponent: React.FC<QuestionAnswerComponentProps> = ({ question, answer, onAnswerChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.questionBox}>
        {question}
      </div>
      <textarea
        value={answer || ''} // Use the answer from props, defaulting to an empty string if undefined
        onChange={onAnswerChange} // Call the passed in function when the input changes
        style={styles.textarea}
        placeholder="Provide your answer here..."
        // rows={3}
      />
    </div>
  );
};


export default QuestionAnswerComponent;

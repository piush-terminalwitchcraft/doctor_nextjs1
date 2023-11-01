import React, { useState } from 'react';

interface TextboxProps {
  setProblems: React.Dispatch<React.SetStateAction<string | undefined>>;
}


function Textbox({ setProblems }: TextboxProps) {
  const [text, setText] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('2.4rem'); // Initial height

  const handleInputChange = (event: any) => {
    const { value, scrollHeight, clientHeight } = event.target;
    setText(value);

    // Set the textarea height based on its content
    setTextareaHeight(scrollHeight > clientHeight ? `${scrollHeight}px` : '2.4rem');
    setProblems(value);
  };

  return (
    <textarea
      value={text}
      onChange={handleInputChange}
      style={{ height: textareaHeight }}
    />
  );
}

export default Textbox;


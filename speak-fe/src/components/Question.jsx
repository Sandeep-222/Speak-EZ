import { useState, useRef } from "react";

function Question({ question, index, onAnswerChange }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const recognitionRef = useRef(null);

  const handleVoiceStart = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
      onAnswerChange(index, transcript); // Update parent in real-time
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  };

  const handleVoiceStop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    onAnswerChange(index, e.target.value); // Update parent when typing
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4">
      <h3 className="text-lg mb-2 text-left">{question}</h3>
      <form>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Type your answer here or speak..."
          className="w-full h-[60px] border border-gray-300 rounded-md px-3 py-2 mb-2"
        />
        <div className="flex justify-end items-center gap-3">
          {listening ? (
            <button
              type="button"
              onClick={handleVoiceStop}
              className="bg-red-500 text-white py-1 px-4 rounded-md cursor-pointer"
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceStart}
              className="bg-green-500 text-white py-1 px-4 rounded-md cursor-pointer"
            >
              Speak
            </button>
          )}

          <button
            type="button"
            onClick={() => setSubmitted(!submitted)}
            className={`py-1 px-4 rounded-md cursor-pointer ${
              submitted ? "bg-gray-900 text-white" : "bg-[#2b3a4a] text-white"
            }`}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Question;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faClock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import api from "../api";
function SpeakTest() {
  const [testLoading, setTestLoading] = useState(false);
  const [ responseLoaded, setResponseLoaded ] = useState(false);
  const [ responseLoading, setResponseLoading ] = useState(false);
  const [ response, setResponse ] = useState(null);
  const [ isSpeaking, setIsSpeaking ] = useState(false);
  const [test, setTest] = useState(false);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const intervalRef = useRef(null);
  const toastShownRef = useRef(false);
  const recognitionRef = useRef(null);

  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  

  useEffect(() => {
      if (!test) {
        return;
      }
  
      if (intervalRef.current) clearInterval(intervalRef.current);
  
      if (test) {
        // Only start when the test begins
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      }
      return () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }; // Cleanup on unmount
    }, [test]);
  
    useEffect(() => {
      if (timeLeft === 0 && test && !toastShownRef.current) {
        toastShownRef.current = true;
        toast.info("Time's up!");
        toastShownRef.current = false;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeLeft(5 * 60);
        handleTestSubmit();
      }
    }, [timeLeft, test]);

    useEffect(() => {
      // Setup Speech Recognition (only works in Chrome/Edge)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true; // live updates
        recognition.maxAlternatives = 1;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
          setAnswer(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          toast.error("Speech recognition error: " + event.error);
        };

        recognitionRef.current = recognition;
      } else {
        toast.error("Speech recognition not supported in this browser!");
      }
}, []);

  const handleStartSpeaking = () => {
    setIsSpeaking(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };


  const handleStartTest = async () => {
    setTest(true);
    setTestLoading(true);
    try {
      const response = await api.get("/ai/Random-text");
      if (response.status === 200) {
        setTestLoading(false);
        setText(response.data.Random_Text);
        console.log(response.data.Random_Text);
      }
    } catch (error) {
      setTestLoading(false);
      setTest(false);
      const message = error.response?.data || "Something went wrong in Vocal Test !!";
      toast.error(message);
    }
  };

  const handleTestSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    clearInterval(intervalRef.current);
    setResponseLoaded(true);
    setResponseLoading(true);
    try {
      const response = await api.post("/ai/Vocal-Score", {
        actualText: text,
        transcribedText: answer
      })
      if( response.status === 200 ){
        setResponseLoading(false);
        setResponse(response.data);
        console.log(response.data);
      }else{
        toast.error("Something went wrong in Vocal Test Evaluation !!");
        setResponseLoading(false);
        setResponseLoaded(false);
        console.log(response)
      }

    } catch (error) {
      setTest(false);
      setAnswer("");
      setTimeLeft(5 * 60);
      if( !answer ){
        toast.error("Answer should not be empty !!");
      }
      console.log(error);
    }
  }

  const handleSubmitReport = async () => {
    // Handle report submission
    try {
      const res = await api.post('/api/TestCount' , { "userId": user._id, "TestType": "Voice" });
      if(res.status === 200){
        toast.success(res.data.message);
        fetchUser();
        navigate('/');
    }
    } catch (error) {
      console.log(error);
      const message = error.response.data.error || error.response.data.message || "Error submitting report" ;
      toast.error(message);
    }

  };

  return (
    <div className="p-3 h-[calc(100vh-100px)] overflow-y-auto box-border">
      {
      
       !test ? (
        <div>
          <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
            Vocal Test
          </p>
          <p className="text-[14px] font-normal text-gray-900 text-left">
            {" "}
            SpeakEZ{" "}
            <FontAwesomeIcon
              className="text-gray-900
                        text-[10px]"
              icon={faGreaterThan}
            />{" "}
            Vocal Test{" "}
          </p>

          <button
            onClick={handleStartTest}
            className="mt-10 bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer"
          >
            {" "}
            Start Test
          </button>
        </div>
      ) : testLoading ? (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.15s]"></div>
        </div>
      ) : ! responseLoaded ? (
        <div className="p-3">
          <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
            Vocal Test
          </p>
          <p className="text-[14px] font-normal text-gray-900 text-left">
            {" "}
            SpeakEZ{" "}
            <FontAwesomeIcon
              className="text-gray-900
                          text-[10px]"
              icon={faGreaterThan}
            />{" "}
            Vocal Test{" "}
          </p>
          <div className="mt-10 py-3 px-4 rounded-md bg-gray-50">
            <div className="flex justify-between">
              <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
                Vocal Test
              </p>
              <p className="text-[25px] font-bold ">
                <FontAwesomeIcon icon={faClock} /> {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            </div>

            <p className="text-[18px] font-normal text-gray-900 text-left">
              {text}
            </p>
            {
              isSpeaking ? (
                <button
                  onClick={handleStopSpeaking}
                  className="mt-4 bg-[#7a6fbe] text-white py-1 px-4 rounded-md cursor-pointer"
                >
                  {" "}
                  Stop Speaking
                </button>
              ) : (
                <button
                  onClick={handleStartSpeaking}
                  className="mt-4 bg-[#7a6fbe] text-white py-1 px-4 rounded-md cursor-pointer"
                >
                  {" "}
                  Start Speaking
                </button>
              )
            }
            <form action="" onSubmit={handleTestSubmit}>
              <div className="mt-4">
                <textarea
                  className="shadow appearance-none border rounded w-full h-[200px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  type="text"
                  placeholder="Start Reading..."
                />
              </div>
              <div className="mt-4 text-right">
                <button className=" bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer">
                  {" "}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    
      ) : responseLoading ? (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.15s]"></div>
        </div>
      ) : (
        <div className="p-3">
          <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
            Vocal Test
          </p>
          <p className="text-[14px] font-normal text-gray-900 text-left">
            {" "}
            SpeakEZ{" "}
            <FontAwesomeIcon
              className="text-gray-900
                          text-[10px]"
              icon={faGreaterThan}
            />{" "}
            Vocal Test{" "}
          </p>
          <div className="mt-10 py-3 px-4 rounded-md bg-gray-50 ">
            <p className="text-[24px] font-medium text-gray-900 text-center mb-4">
              Response
            </p>

            <p className="text-[18px] font-normal text-blue-900 mb-2">
              Accuracy : <span className="font-bold">{response.accuracy}%</span>
            </p>
            

            {/* Matched words */}
            <div className="mb-4">
              <p className="text-[16px] font-medium text-green-700 mb-1">
                Matched Words
              </p>
              <div className="flex flex-wrap gap-2 bg-green-50 p-2 rounded-md max-h-55 overflow-y-auto">
                {response.matchedWords.map((word, idx) => (
                  <span key={idx} className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Mismatched words */}
            <div>
              <p className="text-[16px] font-medium text-red-700 mb-1">
                Mismatched Words
              </p>
              <div className="flex flex-wrap gap-2 bg-red-50 p-2 rounded-md max-h-55 overflow-y-auto">
                {response.mismatchedWords.map((word, idx) => (
                  <span key={idx} className="bg-red-200 text-red-900 px-2 py-1 rounded-md text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <button onClick={handleSubmitReport} className="mt-6 bg-[#12467f] text-white py-1 px-4 rounded-md cursor-pointer">Submit Report</button>
            </div>
          </div>

        </div>
      )
      


    }
    </div>
  );
}

export default SpeakTest;

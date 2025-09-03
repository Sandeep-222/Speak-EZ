import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faClock } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import api from "../api";

function WrittenTestPage() {
  const [cart, setCart] = useState(false);
  const [responseLoaded, setResponseLoaded] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [test, setTest] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const intervalRef = useRef(null);
  const toastShownRef = useRef(false);

  const [misspelledWords, setMisspelledWords] = useState([]);
  const [summary, setSummary] = useState([]);

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

  const handleStartTest = async () => {
    console.log("start test");
    setTest(true);
    setCart(true);
    try {
      const response = await api.get("/ai/WET-random-question");
      if (response.status === 200) {
        setCart(false);
        setQuestion(response.data.question);
      }
    } catch (error) {
      setCart(false);
      setTest(false);
      const message = error.response?.data || "Something went wrong in WET";
      toast.error(message);
    }
  };

  const handleTestSubmit = async (e) => {
    clearInterval(intervalRef.current);
    setResponseLoaded(true);
    setResponseLoading(true);
    if (e) {
      e.preventDefault();
    }
    try {
      const response = await api.post("/ai/English-Score-updated", {
        userResponse: answer,
      });
      if (response.status === 200) {
        setMisspelledWords(response.data.misspelledWords);
        setSummary(response.data.summary);
        setResponseLoading(false);
        toast.success("Got Response");
        setResponseLoaded(true);
        console.log("Misspelled words: ", response.data.misspelledWords);
        console.log("Summary: ", response.data.summary);
      }
    } catch (error) {
      setResponseLoaded(false);
      setResponseLoading(false);
      setTest(false);
      setAnswer("");
      setTimeLeft(5 * 60);
      if( !answer ){
        toast.error("Answer should not be empty !!");
      }
      console.log(error);
      const message =  error.response.data.error || "Something went wrong";
      toast.error(message);
    }
  };

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // In your component
  const chunkedWords = chunkArray(misspelledWords, 5);

  const handleSubmitReport = async () => {
      // Handle report submission
      try {
        const res = await api.post('/api/TestCount' , { "userId": user._id, "TestType": "Written" });
        if(res.status === 200){
          toast.success(res.data.message);
          fetchUser();
          navigate('/');
      }
      } catch (error) {
        console.log(error);
        toast.error("Error submitting report");
      }

    };

  return (
    <div className="p-3 h-[calc(100vh-100px)] overflow-y-auto box-border">
      {!test ? (
        <>
          <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
            {" "}
            Written Test{" "}
          </p>
          <p className="text-[14px] font-normal text-gray-900 text-left">
            {" "}
            SpeakEZ{" "}
            <FontAwesomeIcon
              className="text-gray-900 text-[10px]"
              icon={faGreaterThan}
            />{" "}
            Written Test{" "}
          </p>
          <button
            onClick={() => handleStartTest()}
            className="mt-10 bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer"
          >
            {" "}
            Start Test
          </button>
        </>
      ) : (
        <>
          {cart ? (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.15s]"></div>
            </div>
          ) : (
            <>
              {!responseLoaded ? (
                <>
                  <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
                    {" "}
                    Written Test{" "}
                  </p>
                  <p className="text-[14px] font-normal text-gray-900 text-left">
                    {" "}
                    SpeakEZ{" "}
                    <FontAwesomeIcon
                      className="text-gray-900 text-[10px]"
                      icon={faGreaterThan}
                    />{" "}
                    Written Test{" "}
                  </p>
                  <div className="mt-10 py-3 px-4 rounded-md bg-gray-50">
                    <div className="flex justify-between">
                      <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
                        {" "}
                        Question{" "}
                      </p>
                      <p className="text-[25px] font-bold ">
                        <FontAwesomeIcon icon={faClock} />{" "}
                        {Math.floor(timeLeft / 60)}:
                        {String(timeLeft % 60).padStart(2, "0")}
                      </p>
                    </div>

                    <p className="text-[18px] font-normal text-gray-900 text-left">
                      {question}
                    </p>
                    <form action="" onSubmit={handleTestSubmit}>
                      <div className="mt-4">
                        <textarea
                          className="shadow appearance-none border rounded w-full h-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="answer"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          type="text"
                          placeholder="Write your answer here..."
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
                </>
              ) : responseLoading ? (
                <>
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
                    {" "}
                    Written Test{" "}
                  </p>
                  <p className="text-[14px] font-normal text-gray-900 text-left">
                    {" "}
                    SpeakEZ{" "}
                    <FontAwesomeIcon
                      className="text-gray-900 text-[10px]"
                      icon={faGreaterThan}
                    />{" "}
                    Written Test{" "}
                  </p>
                  <div className="mt-10 py-3 px-4 rounded-md bg-gray-50">
                    <p className="text-[24px] font-medium text-gray-900 text-center mb-4">
                      Response
                    </p>

                    <div>
                      <p className="text-[20px] font-semibold text-gray-800 mb-3 text-left">
                        Misspelled Words
                      </p>

                      <div className="flex gap-8 flex-wrap">
                        {chunkedWords.map((col, colIndex) => (
                          <div key={colIndex} className="flex flex-col gap-2">
                            {col.map((w, index) => (
                              <div key={index} className="flex items-center">
                                <span className="line-through text-gray-400 mr-2">
                                  {w.word}
                                </span>
                                <span className="font-bold text-green-700">
                                  {w.suggested}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-[20px] font-semibold text-gray-800 mb-3 text-left">Summary</p>
                        {summary && summary.length > 0 ? (
                          <p className="text-[17px] font-normal text-gray-700 text-left">
                            {summary.join(', ')}
                          </p>
                        ) : (
                          <p className="text-[18px] font-normal text-gray-900 text-left">
                            No summary available
                          </p>
                        )}
                      </div>

                    </div>


                  </div>

                  <div>
                    <button onClick={handleSubmitReport} className="mt-20 bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer">Submit Report</button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default WrittenTestPage;

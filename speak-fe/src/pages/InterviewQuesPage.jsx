import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Question from "../components/Question";
import axios from "axios";
import { useUser} from "../context/UserContext";
import api from "../api";
import { toast } from "react-toastify";

function InterviewQuesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, fetchUser } = useUser();

    const [ showChart, setShowChart ] = useState(false);
    const { questions } = location.state || { questions: localStorage.getItem("questions") || [] };
    
    const [positiveScore,setPositiveScore]=useState(null);
    const [negativeScore,setnegativeScore]=useState(0);
    const [neutralScore,setneutralScore]=useState(0);

    const [ isSubmitted, setIsSubmitted ] = useState(false);
    // Format the questions
    let temp=questions;
    temp = temp.replace(/^```(?:json)?|```$/g,'').trim();
    temp=temp.replace("```","");
    const cleanquestionsArray = JSON.parse(temp);
    localStorage.setItem("questions", JSON.stringify(cleanquestionsArray));
    // console.log(cleanquestionsArray);

    const [answers, setAnswers] = useState(Array(cleanquestionsArray.length).fill(""));

    const handleAnswerChange = (index, answer) => {
        setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[index] = answer;
        return newAnswers;
        });
    };

    console.log(answers);
    const SubmitAnswers = async () => {
      setPositiveScore(0);
      setnegativeScore(0);
      setneutralScore(0);

      try {
        setShowChart(true);
        setIsSubmitted(true);

        // Animate chart loading
        // for (let i = 1; i <= 100; i++) {
        //   setTimeout(() => setvalue_cur(i), i * 30);
        // }

        const endpoint = "https://sanjaybravestone.cognitiveservices.azure.com";
        const response = await axios.post(
          `${endpoint}/text/analytics/v3.0/sentiment`,
          {
            documents: answers.map((value, index) => ({
              id: String(index + 1),
              text: value,
            })),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AZURE_API_KEY,
            },
          }
        );
       

        const totalCount = response.data.documents.length;

        let positive = 0, negative = 0, neutral = 0;

        response.data.documents.forEach((doc) => {
          positive += doc.confidenceScores.positive / totalCount;
          negative += doc.confidenceScores.negative / totalCount;
          neutral += doc.confidenceScores.neutral / totalCount;
        });

        setShowChart(false)
        setPositiveScore(Math.round(positive * 100));
        setnegativeScore(Math.round(negative * 100));
        setneutralScore(Math.round(neutral * 100));

        
      } catch (error) {
        console.error("Error analyzing sentiment:", error);
      }
    };

    useEffect(() => {
      console.log(positiveScore,negativeScore,neutralScore);
    },[positiveScore,negativeScore,neutralScore]);

    const handleSubmitReport = async () => {
      // Handle report submission
      try {
        const res = await api.post('/api/TestCount' , { "userId": user._id, "TestType": "AI" });
        if(res.status === 200){
          toast.success(res.data.message);
          fetchUser();
          navigate('/');
          localStorage.removeItem("questions");
      }
      } catch (error) {
        toast.error("Error submitting report");
      }

    };
    
    return (
        <div className="p-3 h-[calc(100vh-100px)] overflow-y-auto box-border">
            { !isSubmitted ? (
                <>
                  <h1 className="text-2xl font-normal mb-2">Questions </h1>
                  {cleanquestionsArray.map((question, index) => (
                      <Question key={index} index={index} question={question} onAnswerChange={handleAnswerChange} />
                  ))}

                  <div>
                      <button onClick={()=>SubmitAnswers()} className="mt-2 bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer">Submit Test</button>
                  </div>
                </>
            ): (
              <div className="flex flex-col items-center justify-center">
                { showChart ? (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                  </div>
                ): (
                  < >
                    <h2 className="text-3xl font-bold mb-4">Results</h2>
                    <div className="mb-4 flex gap-20">
                      <p className="text-gray-800 text-[20px]">Positive: {positiveScore}%</p>
                      <p className="text-gray-800 text-[20px]">Negative: {negativeScore}%</p>
                      <p className="text-gray-800 text-[20px]">Neutral: {neutralScore}%</p>
                    </div>

                    <button onClick={()=>handleSubmitReport()} className="mt-2 bg-[#2b3a4a] text-white py-1 px-4 rounded-md cursor-pointer">Submit Report</button>
                  </>
                    
                )}
              </div>
            )}

        </div>
        
    );
}



export default InterviewQuesPage;

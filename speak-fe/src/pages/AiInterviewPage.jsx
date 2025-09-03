import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/AIpage.css";

function AiInterviewPage() {
  const [resume, setResume] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [getQuestions, setGetQuestions] = useState(false);
  const [ questions, setQuestions ] = useState(null);

  const navigate = useNavigate();

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleUpload = async () => {
    if (!resume) {
      toast.info("Please upload resume");
    } else {
      try {
        setScanning(true);
        setGetQuestions(false);
        const formData = new FormData();
        formData.append("file", resume);
        const response = await api.post("/ai/upload", formData);
        if (response.status === 200) {
          toast.success("File uploaded successfully");
          try {
              const questions = await api.post("/ai/getquestions" , { JobSkills: response.data.Skills , ApplicantName: response.data.CandidateName.full, JobRole: response.data.WorkExperience } );
              console.log(questions.data.msg);
              setScanning(false);
              toast.success("Questions fetched successfully");
              setQuestions(questions.data.msg);
              setGetQuestions(true);
          } catch (error) {
              setGetQuestions(false);
              setScanning(false);
              toast.error("Something went wrong while getting questions");
          }
        }
      } catch (error) {
        setGetQuestions(false);
        setScanning(false);
        const message = error.response?.data || "Something went wrong";
        toast.error(message);
      }
    }
  };

  const handleGetQuestions = () => {
      navigate("/questions", { state: { questions: questions } });
  }

  return (
    <div className="p-3">
      <p className="text-[24px] font-medium text-gray-900 text-left mb-1.5">
        AI Interview
      </p>
      <p className="text-[14px] font-normal text-gray-900 text-left">
        {" "}
        SpeakEZ{" "}
        <FontAwesomeIcon
          className="text-gray-900
       text-[10px]"
          icon={faGreaterThan}
        />{" "}
        AI Interview{" "}
        <FontAwesomeIcon
          className="text-gray-900
       text-[10px]"
          icon={faGreaterThan}
        />{" "}
        resume{" "}
      </p>

      <div className="flex items-center gap-4 mt-8">
        {/* Styled file input */}
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf"
          onChange={handleResumeChange}
          className=" w-max text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-1 file:px-4  file:bg-gray-700 file:text-white file:cursor-pointer"
        />

        {/* <label htmlFor="resume" className="text-sm border border-gray-300 rounded-md cursor-pointer mr-4 py-1 px-4 bg-gray-700 text-white"> Choose file</label> */}

        {/* Separate Upload button */}
        <button
          onClick={handleUpload}
          className=" text-sm px-4 py-1 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800"
        >
          Upload
        </button>
      </div>

      {/* {resume && (
          <p className="mt-2 text-gray-600 text-left text-sm">
            Selected file: {resume.name} ({Math.round(resume.size / 1024)} KB)
          </p>
        )} */}

      {scanning && (
        <div className="w-full mt-3">
          <p className="text-gray-600 text-left text-sm mb-1">
            Scanning resume...
          </p>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 via-green-600 to-green-400 animate-scanner"></div>
          </div>
        </div>
      )}

      {getQuestions && (
        <button onClick={() => handleGetQuestions()} className="text-sm px-4 py-1 mt-10 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800">
          {" "}
          GetQuestions{" "}
        </button>
      )}

    </div>
  );
}

export default AiInterviewPage;

import { useState } from "react";
import { Check, Circle, X } from "react-feather";
import supabase from "@/utils/supabase";
const mcqChoices = ["A", "B", "C", "D", "E"];
// const questions = [
//   {
//     question: "What is the capital of France?",
//     answers: ["Paris", "London", "New York", "Tokyo"],
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the largest organ in the human body?",
//     answers: ["Heart", "Lungs", "Liver", "Skin"],
//     correctAnswer: "Skin",
//   },
//   {
//     question: "What is the smallest country in the world?",
//     answers: ["Russia", "Vatican City", "Monaco", "Maldives"],
//     correctAnswer: "Vatican City",
//   },
// ];

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await supabase.from("questions").select().limit(5);

  // Pass data to the page via props
  return { props: { questions: res.data } };
}

export default function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [buttonText, setButtonText] = useState("Check");
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  //const { data: questions, error } = await supabase.from("questions").select();
  const handleOptionSelect = (option) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(false);
  };

  const handleNextQuestion = () => {
    setSelectedOption("");
    setShowAnswer(false);
    setCurrentQuestion(currentQuestion + 1);
    setButtonText("Check");
  };

  const currentQuiz = questions[currentQuestion];

  const FloatingBottomBar = () => {
    return (
      <div className="fixed bottom-0 left-0 w-full h-16 border-2 border-gray-300 text-white flex items-center justify-end p-4 gap-2">
        {answers.map((correctAnswer, index) =>
          correctAnswer === null ? (
            <Circle key={index} color="#808080" size={24} />
          ) : correctAnswer === true ? (
            <Check key={index} color="#00C853" size={24} />
          ) : (
            <X key={index} color="#D50000" size={24} />
          )
        )}
        {!showAnswer && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 w-24 rounded"
            onClick={() => {
              setShowAnswer(true);
              if (
                questions[currentQuestion].answers.indexOf(selectedOption) ===
                mcqChoices.indexOf(questions[currentQuestion].correctAnswer)
              ) {
                setScore(score + 1);
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = true;
                setAnswers(newAnswers);
                console.log(newAnswers);
              } else {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = false;
                setAnswers(newAnswers);
              }
            }}
          >
            {buttonText}
          </button>
        )}
        {showAnswer && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 w-24 rounded"
            onClick={handleNextQuestion}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className=" overflow-y-scroll pt-32 bg-gray-100 flex justify-center">
      <div className="max-w-lg w-full my-auto">
        <h1 className="text-2xl">Quiz</h1>
        {currentQuiz && (
          <div>
            <h2 dangerouslySetInnerHTML={{ __html: currentQuiz.question }}></h2>
            <ul>
              {currentQuiz.answers.map((option, index) => (
                <li key={index}>
                  <label className="flex ">
                    <input
                      className={
                        "mr-2 w-4 h-4 mt-1 " +
                        (showAnswer
                          ? questions[currentQuestion].answers.indexOf(
                              option
                            ) === mcqChoices.indexOf(currentQuiz.correctAnswer)
                            ? "accent-green-300"
                            : questions[currentQuestion].answers.indexOf(
                                selectedOption
                              ) ===
                              questions[currentQuestion].answers.indexOf(option)
                            ? "accent-red-300"
                            : ""
                          : questions[currentQuestion].answers.indexOf(
                              selectedOption
                            ) ===
                            questions[currentQuestion].answers.indexOf(option)
                          ? "accent-blue-300"
                          : "")
                      }
                      type="radio"
                      value={option}
                      checked={
                        questions[currentQuestion].answers.indexOf(
                          selectedOption
                        ) ===
                          questions[currentQuestion].answers.indexOf(option) ||
                        (showAnswer &&
                          questions[currentQuestion].answers.indexOf(option) ===
                            mcqChoices.indexOf(currentQuiz.correctAnswer))
                      }
                      onChange={() => handleOptionSelect(option)}
                    />
                    <div dangerouslySetInnerHTML={{ __html: option }}></div>
                  </label>
                </li>
              ))}
            </ul>
            {showAnswer && (
              <p
                className="pt-4"
                dangerouslySetInnerHTML={{
                  __html: questions[currentQuestion].explanation,
                }}
              ></p>
            )}
          </div>
        )}
      </div>
      <FloatingBottomBar />
    </div>
  );
}

// {currentQuestion === questions.length && (
//   <div>
//     <h2>Results</h2>
//     <p>
//       You scored {score} out of {questions.length}
//     </p>
//   </div>
// )}

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

const colors = [
  "bg-rose-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-purple-400",
  "bg-teal-400",
  "bg-pink-400",
  "bg-amber-400",
];
const units = [
  "Chemistry of Life",
  "Cell Structure and Function",
  "Cellular Energetics",
  "Cell Communication and Cell Cycle",
  "Heredity",
  "Gene Expression and Regulation",
  "Natural Selection",
  "Ecology",
];
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await supabase
    .from("ap_gov_questions")
    .select()
    .order("id", "ascending")

  // Pass data to the page via props
  return { props: { questions: res.data.sort(() => 0.5 - Math.random()).slice(0, 10) } };
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
  console.log(questions, currentQuiz);
  const BottomBar = () => {
    return (
      <div className="w-full h-16 border-2 border-gray-300 text-white flex items-center justify-end p-4 gap-2">
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
    <div className="flex items-center flex-col h-screen">
      <div className="max-w-lg w-full overflow-y-scroll h-full py-6">
        <h1 className="text-2xl pb-2">AP U.S. Government and Politics</h1>
        {currentQuiz && (
          <div>
            <h2 dangerouslySetInnerHTML={{ __html: currentQuiz.question }}></h2>
            <ul>
              {currentQuiz.answers.map((option, index) => {
                const optionId =
                  questions[currentQuestion].answers.indexOf(option);
                const selectedOptionId =
                  questions[currentQuestion].answers.indexOf(selectedOption);
                const correctAnswerId = mcqChoices.indexOf(
                  currentQuiz.correctAnswer
                );
                return (
                  <li key={index}>
                    <label className="flex">
                      <div>
                        <input
                          className={
                            "mr-2 w-4 h-4 mt-1 " +
                            (showAnswer
                              ? optionId === correctAnswerId
                                ? "accent-green-300"
                                : selectedOptionId === optionId
                                ? "accent-red-300"
                                : ""
                              : selectedOptionId === optionId
                              ? "accent-blue-300"
                              : "")
                          }
                          type="radio"
                          value={option}
                          checked={
                            selectedOptionId === optionId ||
                            (showAnswer && optionId === correctAnswerId)
                          }
                          onChange={() => handleOptionSelect(option)}
                        />
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: option.substring(4, option.length - 5),
                        }}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
            {/* {units.map((u, i) => (
              <button
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("questions")
                    .update({ unit: i + 1 })
                    .eq("id", currentQuestion + 1);
                  console.log(data, error);
                }}
                key={i}
                className={`p-2 ${colors[i]}`}
              >
                {u}
              </button>
            ))} */}
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
      <BottomBar />
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

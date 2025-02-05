import { useContext, useState } from "react";
import QuestionTestContext from "../context/QuestionTestContext";
import { Question } from "../models/Question";
import { isLastQuestion } from "../utils/helper";
import useStateTest from "./useStateTest";

const useQuestions = () => {
  const {
    questions,
    setQuestions,
    refQuestions,
    setRefQuestions,
    currentActiveQuestion,
    refCurrentActiveQuestion,
    setCurrentActiveQuestion,
    setRefCurrentActiveQuestion,
    currentActiveResponse,
    setCurrentActiveResponse,
    showQuestionModal,
    setShowQuestionModal,
    countQuestion,
    setCountQuestion,
    stopTestQuestion,
    setStopTestQuestion
  } = useContext(QuestionTestContext);

  // 'OFF' | 'START' | 'DONE' | 'REVIEW'
  const { updateState, state, currentActiveTest } = useStateTest()

  const [totalQuestion,setTotalQuestion] = useState(0)

  const updateQuestions = (questions: Question[]) => {
    setQuestions(questions);
    setCurrentActiveQuestion(questions[0])
    setRefCurrentActiveQuestion(questions[0])
    setTotalQuestion(questions.length)
    setCountQuestion(1)
  };

  const startTest = () => {
    updateState('START')
  }

  const reStartCurrentTest = () => {
    updateState('OFF')
  }

  const updateRefQuestions = (questions: Question[]) => {
    setRefQuestions(questions)
  }

  const updateCurrentQuestion =  (question: Question) => {
    setCurrentActiveQuestion(question)
  }

  const desactiveQuestion = () => {
    if(currentActiveQuestion){
      activeStopTest() // stop timer
      setCurrentActiveQuestion({...currentActiveQuestion,time_is_over: true})
    }
  }

  const toggleActiveQuestion = () => {    
    if(currentActiveQuestion){
      toggleStopTest() // toggle timer
      setCurrentActiveQuestion({...currentActiveQuestion,time_is_over: !currentActiveQuestion.time_is_over})
    }
  }

  const toggleStopTest = () => {
    setStopTestQuestion(!stopTestQuestion)
  }

  const activeStopTest = () => {
    setStopTestQuestion(true)
  }

  const activeQuestion = () => {
    if(currentActiveQuestion){
      setCurrentActiveQuestion({...currentActiveQuestion,time_is_over: false})
    }
  }

  const updateCurrentResponse =  (response: string) => {
    setCurrentActiveResponse(response)
  }

  const next = () => {

    if(state !== 'DONE'){
      // on vide la reponse en state
      setCurrentActiveResponse('')
    }

    // a chaque fois on verifie si la question active n'est pas la derniere 
    if(!isLastQuestion(questions,refCurrentActiveQuestion as Question)){
      let index = questions.indexOf(refCurrentActiveQuestion as Question) + 1
      setCountQuestion(countQuestion+1)

      if(!isLastQuestion(questions,refCurrentActiveQuestion as Question)) updateState('DONE')

      setCurrentActiveQuestion(questions[index])
      setRefCurrentActiveQuestion(questions[index])
    }else{      
      if(state === 'OFF'){
        updateState('START')
      }else if(state === 'START'){
        updateState('DONE')
      }else if(state === 'DONE'){
        // on verifie si on repondu a toutes les questions on été repondu
        updateState('END')
      }
    }
  }

  const prev = () => {
    let index = questions.indexOf(refCurrentActiveQuestion as Question) - 1
    setCountQuestion(countQuestion-1)
    setCurrentActiveQuestion(questions[index])
    setRefCurrentActiveQuestion(questions[index])
  }

  const closeModal = () => setShowQuestionModal(false)
  const openModal = () => setShowQuestionModal(true)

  return {
    next,
    prev,
    questions,
    updateQuestions,
    refQuestions,
    updateRefQuestions,
    totalQuestion,
    updateCurrentQuestion,
    currentQuestion: currentActiveQuestion,
    refCurrentQuestion: refCurrentActiveQuestion,
    updateCurrentResponse,
    currentResponse: currentActiveResponse,
    showEndQuestionModal: showQuestionModal,
    closeEndQuestionModal: closeModal,
    openEndQuestionModal: openModal,
    countQuestion,
    desactiveQuestion,
    activeQuestion,
    toggleActiveQuestion,
    toggleStopTest,
    stopTestQuestion,
    startTest,
    reStartCurrentTest,
    setStopTestQuestion,
  };
};

export default useQuestions;

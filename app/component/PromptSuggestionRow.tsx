import React from 'react'
import promptSuggestionButton from './promptSuggestionButton'

const PromptSuggestionRow = ({onPromptClick}) => {
    const promptSuggestions = [
  "What's your tech stack for fullstack development?",
  "Tell me about your blockchain experience and projects",
  "How do you integrate AI automation in your applications?",
  "What programming languages are you most proficient in?"
    ]
  return (
    <div>
      {promptSuggestions.map((prompt, index) =><promptSuggestionButton key={index}  text={prompt} onClick={() => onPromptClick(prompt)}/>)}
    </div>
  )
}

export default PromptSuggestionRow

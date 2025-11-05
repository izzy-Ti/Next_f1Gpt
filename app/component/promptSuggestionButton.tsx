import React from 'react'

function promptSuggestionButton({text, onclick}) {
  return (
    <div>
      <button onClick={onclick}>
        {text}
      </button>
    </div>
  )
}

export default promptSuggestionButton

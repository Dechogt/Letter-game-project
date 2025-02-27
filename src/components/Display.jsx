import React from 'react'

function Display() {
  
    throwLetter()= (e)=> {
      if e.target.value == " " {
        let n= Math.random()
        lettre = lettres[n]
        return lettre
      }
    }

    updateScore()= ()=>{
      if e = lettre 
          score++
    }
  return (
    <div>
        <p>Votre score est de: {score} </p>
        {lettre}
    </div>
  )
}

export default Display
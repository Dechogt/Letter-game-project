import React, { useState, useEffect, useRef } from "react";

function FallingLettersGame() {
  // État pour savoir si le jeu est lancé
  const [gameStarted, setGameStarted] = useState(false);
  // État pour le score
  const [score, setScore] = useState(0);
  // État pour stocker la liste des lettres qui tombent
  // Chaque lettre est un objet { id, letter, top, left }
  const [letters, setLetters] = useState([]);
  // Référence à la zone de jeu pour connaître ses dimensions
  const gameAreaRef = useRef(null);

  // Fonction pour ajouter une nouvelle lettre en haut, à une position horizontale aléatoire
  const addLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter =
      alphabet[Math.floor(Math.random() * alphabet.length)];
    const gameAreaWidth = gameAreaRef.current
      ? gameAreaRef.current.clientWidth
      : 300;
    // Position horizontale aléatoire (en pixels)
    const randomLeft = Math.floor(Math.random() * (gameAreaWidth - 30));
    // Ajout d'un objet lettre avec top initial à 0
    setLetters((prev) => [
      ...prev,
      { id: Date.now(), letter: randomLetter, top: 0, left: randomLeft }
    ]);
  };

  // Animation : faire tomber les lettres en augmentant leur position verticale
  useEffect(() => {
    let intervalId;
    if (gameStarted) {
      intervalId = setInterval(() => {
        setLetters((prevLetters) =>
          prevLetters.map((letter) => ({
            ...letter,
            top: letter.top + 5 // Vitesse de chute, ajustable
          }))
        );
      }, 100); // mise à jour toutes les 100 ms
    }
    return () => clearInterval(intervalId);
  }, [gameStarted]);

  // Ajout régulier de nouvelles lettres lorsque le jeu est lancé
  useEffect(() => {
    let addLetterInterval;
    if (gameStarted) {
      addLetterInterval = setInterval(() => {
        addLetter();
      }, 1000); // une lettre toutes les 1 seconde
    }
    return () => clearInterval(addLetterInterval);
  }, [gameStarted]);

  // Suppression des lettres qui dépassent la zone de jeu
  useEffect(() => {
    if (gameAreaRef.current) {
      const gameAreaHeight = gameAreaRef.current.clientHeight;
      setLetters((prevLetters) =>
        prevLetters.filter((letter) => letter.top < gameAreaHeight)
      );
    }
  }, [letters]);

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si le jeu n'est pas démarré, démarrer le jeu quand on appuie sur espace
      if (!gameStarted && e.key === " ") {
        setGameStarted(true);
      } else if (gameStarted && e.key.length === 1) {
        // Si le jeu est lancé et qu'une touche lettre est pressée
        const pressedLetter = e.key.toUpperCase();
        // Chercher si la lettre correspond à l'une des lettres qui tombent
        const letterIndex = letters.findIndex(
          (letter) => letter.letter === pressedLetter
        );
        if (letterIndex !== -1) {
          // Supprimer la lettre trouvée et incrémenter le score
          setLetters((prev) =>
            prev.filter((_, idx) => idx !== letterIndex)
          );
          setScore((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, letters]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Jeu des lettres qui tombent</h1>
      <p>Score : {score}</p>
      {/* Zone de jeu */}
      <div
        ref={gameAreaRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          height: "400px",
          margin: "0 auto",
          border: "2px solid #333",
          overflow: "hidden"
        }}
      >
        {letters.map((letter) => (
          <div
            key={letter.id}
            style={{
              position: "absolute",
              top: letter.top,
              left: letter.left,
              fontSize: "24px",
              fontWeight: "bold"
            }}
          >
            {letter.letter}
          </div>
        ))}
      </div>
      {!gameStarted && (
        <p>Appuyez sur la barre espace pour démarrer le jeu</p>
      )}
    </div>
  );
}

export default FallingLettersGame;
 
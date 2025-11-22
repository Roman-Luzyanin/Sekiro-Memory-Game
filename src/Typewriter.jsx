import { useState, useEffect } from "react";

export default function Typewriter({ message = "", speed = 100, delay = 0 }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  // Start typing after delay (runs ONCE per message)
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true); // typing may begin
    }, delay);

    return () => clearTimeout(startTimer);
  }, [message, delay]);

  // Typing logic
  useEffect(() => {
    if (!started) return; // do nothing until delay has passed

    if (index >= message.length) return;

    const interval = setTimeout(() => {
      setText((prev) => prev + message[index]);
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(interval);
  }, [index, started, message, speed]);

  // Reset when message changes
  useEffect(() => {
    setText("");
    setIndex(0);
    setStarted(false);
  }, [message]);

  return <p>{text}</p>;
}

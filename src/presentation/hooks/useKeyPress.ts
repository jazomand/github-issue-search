import { useState, useEffect } from 'react';

export default function useKeyPress(targetKeyCode: number) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ keyCode } : { keyCode: number }) {
    if (keyCode === targetKeyCode) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ keyCode } : { keyCode: number }) => {
    if (keyCode === targetKeyCode) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
}

export const keys = {
  arrowDown: {
    keyCode: 40
  },
  arrowUp: {
    keyCode: 38
  },
  escape: {
    keyCode: 27
  }
};
import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';
import './App.scss';

const calculatorData = [
  { id: "clear", value: "AC" },
  { id: "divide", value: "/" },
  { id: "multiply", value: "x" },
  { id: "seven", value: 7 },
  { id: "eight", value: 8 },
  { id: "nine", value: 9 },
  { id: "subtract", value: "-" },
  { id: "four", value: 4 },
  { id: "five", value: 5 },
  { id: "six", value: 6 },
  { id: "add", value: "+" },
  { id: "one", value: 1 },
  { id: "two", value: 2 },
  { id: "three", value: 3 },
  { id: "equals", value: "=" },
  { id: "zero", value: 0 },
  { id: "decimal", value: "." }
];

const operators = ["AC", "/", "x", "-", "+", "="];

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const Display = ({ input, output }) => {
  return (
    <div className="display-container" >
      <p className="operation-output">{output}</p>
      <p id="display" className="operation-input">{input}</p>
    </div>
  )
}

const CalcBtn = ({ calcData: { id, value }, handleInput }) => {
  return (
    <button id={id} onClick={() => handleInput(value)} >
      {value}
    </button>
  )
}

const CalcKeyboard = ({ handleInput }) => {
  return (
    <div className="calc-buttons" >
      {calculatorData.map((btn) => {
        return <CalcBtn btn={btn.id} calcData={btn} handleInput={handleInput} />
      })}
    </div>
  )
}

function CalculatorApp() {
  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("");
  const [calcData, setCalcData] = useState("");
  const [lastButton, setLastButton] = useState(null);

  const handleSubmit = () => {
    const total = math.evaluate(calcData);

    setInput(total.toString());
    setOutput(`${calcData} = ${total}`);
    setCalcData(`${total}`);
  }

  const handleClear = () => {
    setInput("0");
    setCalcData("");
  }

  const handleNumbers = (value) => {
    if (!calcData.length) {
      setInput(`${value}`);
      setCalcData(`${value}`);
    } else {
      if (value === 0 && (calcData === "0" || input === "0")) {
        setCalcData(`${calcData}`);
      } else {
        const lastChat = calcData.charAt(calcData.length - 1);
        const isLastChatOperator = lastChat === "*" || operators.includes(lastChat);

        setInput(isLastChatOperator ? `${value}` : `${input}${value}`);
        setCalcData(`${calcData}${value}`)
      }
    }
  }

  const dotOperator = () => {
    const lastChat = calcData.charAt(calcData.length - 1);
    if (!calcData.length) {
      setInput("0.");
      setCalcData("0.");
    } else {
      if (lastChat === "*" || operators.includes(lastChat)) {
        setInput("0.");
        setCalcData(`${calcData} 0.`);
      } else {
        setInput(
          lastChat === "." || input.includes(".") ? `${input}` : `${input}.`
        );
        const formattedValue =
          lastChat === "." || input.includes(".")
            ? `${calcData}`
            : `${calcData}.`;
        setCalcData(formattedValue);
      }
    }
  }

  const handleOperators= (value) => {
    if (lastButton === "=") {
    setCalcData(input);
    }

    if (calcData.length) {
      setInput(`${value}`);
      const beforeLastChat = calcData.charAt(calcData.length - 2);

      const beforeLastChatIsOperator =
        operators.includes(beforeLastChat) || beforeLastChat === "*";

      const lastChat = calcData.charAt(calcData.length - 1);
      
      const lastChatIsOperator = operators.includes(lastChat) || lastChat === "*";
      
      const validOp = value === "x" ? "*" : value;
      if (
        (lastChatIsOperator && value !== "-") ||
        beforeLastChatIsOperator && lastChatIsOperator
      ) {
        if (beforeLastChatIsOperator) {
          const updatedValue = `${calcData.substring(
            0,
            calcData.length - 2
          )}${value}`;
          setCalcData(updatedValue);
        } else {
          setCalcData(`${calcData.substring(0, calcData.length - 1)}${validOp}`);
        }
      } else {
        setCalcData(`${calcData}${validOp}`);
      }
    }
  }

  const handleInput = (value) => {
    setLastButton(value);
    const number = numbers.find((num) => num === value);
    const operator = operators.find((op) => op === value);

    switch (value) {
      case "=":
        handleSubmit();
        break;
      case "AC":
        handleClear();
        break;
      case number:
        handleNumbers(value);
        break;
      case ".":
        dotOperator(value);
        break;
      case operator:
        handleOperators(value);
        break;
      default:
        break;
    }
  }

  const handleOutput = () => {
    setOutput(calcData)
  }

  useEffect(() => {
    handleOutput()
  }, [calcData])

  return (
    <>
      <Display input={input} output={output} />
      
      <CalcKeyboard handleInput={handleInput} />
    </>
  );
}

export default CalculatorApp;
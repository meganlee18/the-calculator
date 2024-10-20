import "./App.css";
import { Screen } from "./components/Screen.js";
import { ButtonBox } from "./components/ButtonBox.js";
import { Button } from "./components/Button.js";
import { Wrapper } from "./components/Wrapper.js";
import React, { useState } from "react";

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const buttons = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

export const App = () => {
  const [calculator, setCalculator] = useState({
    operator: "",
    digit: 0,
    result: 0,
  });

  const resetClickHandler = () => {
    // The resetClickHandler function defaults all the initial values of calc, 
    // returning the calc state as it was when the Calculator app was first rendered
    setCalculator({
      ...calculator,
      operator: "",
      digit: 0,
      result: 0
    })

  };

  const invertClickHandler = () => {
    // The invertClickHandler function first checks if there’s any entered 
    // value (num) or calculated value (res) and then inverts them by multiplying 
    // with -1:
    setCalculator({
      operator: "",
      digit: calculator.number ? toLocaleString(removeSpaces(calculator.number) * -1) : 0,
      result: calculator.result ? toLocaleString(removeSpaces(calculator.result) * -1) : 0,
    })
  };

  const percentClickHandler = () => {
    const num = calculator.digit ? parseFloat(removeSpaces(calculator.digit)) : 0;
    const result = calculator.result ? parseFloat(removeSpaces(calculator.result)) : 0;

    // checks if there’s any entered value (num) or calculated value (res) and then 
    //calculates the percentage using the built-in Math.pow function, which returns 
    //the base to the exponent power:

    setCalculator({
      ...calculator,
      operator: "",
      digit: num / Math.pow(100, 1),
      result: result / Math.pow(100, 1),
    })
  };

  const equalsClickHandler = () => {
    // calculates the result when the equals button (=) is pressed. The calculation is based on the current 
    // num and res value, as well as the sign selected (see the math function).
    //The returned value is then set as the new res 

    const equations = (a, b, operator) => {
      if (operator === "+") {
        return a + b;
      }
    
      if (operator === "-") {
        return a - b;
      }
    
      if (operator === "X") {
        return a * b;
      }
    
      if (operator === "/") {
        return a / b;
      }
    };
    
    setCalculator({
      ...calculator,
      operator: "",
      digit: 0,
      result:
        calculator.digit === 0 && calculator.operator === "/"
          ? "ERR" //cannot digit divide by 0
          : equations(
              Number(removeSpaces(calculator.result)),
              Number(removeSpaces(calculator.digit)),
              calculator.operator
            ),
    });
  };

  const signClickHandler = (e) => {
    // The signClickHandler function gets fired when the user press either +, –, * or /. 
    //The particular value is then set as a current sign value in the calc object.

    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculator({
      ...calculator,
      operator: value,
      digit: 0,
      result:
        !calculator.result && calculator.digit
          ? calculator.digit
          : calculator.result,
    });
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculator({
      ...calculator,
      digit: !calculator.digit.toString().includes(".")
        ? calculator.digit + value
        : calculator.digit,
    });
  };

  const numClickHandler = (e) => {
    // checks if any of the number buttons (0–9) are pressed. 
    // Then it gets the value of the Button and adds that to the current num value.
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calculator.digit).length < 16) {
      setCalculator({
        ...calculator,
        digit:
          calculator.digit === 0 && value === "0"
            ? "0"
            : removeSpaces(calculator.digit) % 1 === 0 //making sure only whole no.
            ? toLocaleString(Number(calculator.digit + value))
            : toLocaleString(calculator.digit + value),
        result: !calculator.result ? 0 : calculator.result,
      });
    }
  };

  return (
    <Wrapper>
      <Screen
        value={calculator.digit ? calculator.digit : calculator.result}
      ></Screen>
      <ButtonBox>
        {buttons.flat().map((button, index) => {
          return (
            <Button
              key={index}
              className={button === "=" ? "equals" : ""}
              value={button}
              onClick={
                button === "C"
                  ? resetClickHandler
                  : button === "+-"
                  ? invertClickHandler
                  : button === "%"
                  ? percentClickHandler
                  : button === "="
                  ? equalsClickHandler
                  : button === "/" || button === "X" || button === "-" || button === "+"
                  ? signClickHandler
                  : button === "."
                  ? commaClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;

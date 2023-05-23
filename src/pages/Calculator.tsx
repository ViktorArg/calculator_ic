import { useEffect, useState } from 'react';
import '../App.css';
import motokoLogo from '../assets/motoko_moving.png';
import reactLogo from '../assets/react.svg';
import discordLogo from '../assets/discord.jpg';
import { backend } from '../declarations/backend';
import { Icon } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SuperscriptIcon from '@mui/icons-material/Superscript';

function Calculator() {
  const [count, setCount] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [input, setInput] = useState("");
  const [firstInput, setFirstInput] = useState("");
  const [operator, setOperator] = useState("");
  const [canisterCall, setCanisterCall] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);
  const [warningMessageText, setWarningMessageText] = useState("You should input a number!");

  const inputNum = async (e: string) => {
    if(firstInput !== "" && e === "<"){
      setWarningMessage(false);
      return setFirstInput(firstInput.slice(0, -1));
    }
    if(operator === "" && count === 0){
      setWarningMessage(false);
      return setFirstInput(firstInput + e)
    }
    if (e === "<"){
      setInput(input.slice(0, -1));
    } else {
      if(operator !== ""){
        setInput(input + e);
      } else {
        setWarningMessageText("You should select an operator!");
        setWarningMessage(true);
      }
    }
  };

  const operatorType = async (e: any) => {
    if(firstInput !== ""){
      setOperator(e);
      setLoadingText("Initializing...");
      setLoading(true);
      await backend.set(Number(firstInput));
      setCanisterCall(!canisterCall);
      setFirstInput("");
      setWarningMessage(false);
      return setLoading(false);
    }
    if(firstInput === "" && input === "" && count === 0){
      setWarningMessageText("You should input a number!");
      return setWarningMessage(true);
    }
    setOperator(e);
    await equals(e);
    setWarningMessage(false);
  };

  const equals = async (e: string) => {
    if(!operator){
      setWarningMessageText("You should input a number!");
      return setWarningMessage(true);
    };
    setWarningMessage(false);
    setLoadingText("Calculating...");
    setLoading(true);
    switch (operator) {
      case "/":
        try {
          await backend.div(Number(input));
        } catch (err) {
          console.error("err div", err);
        }
        break;
      case "+":
        try {
          await backend.add(Number(input));
        } catch (err) {
          console.error("err add", err);
        }
        break;
      case "x":
        try {
          await backend.mul(Number(input));
        } catch (err) {
          console.error("err mul", err);
        }
        break;
      case "-":
        try {
          await backend.sub(Number(input));
        } catch (err) {
          console.error("err sub", err);
        }
        break;
      case "√":
        try {
          await backend.sqrt();
        } catch (err) {
          console.error("err sqrt", err);
        }
        break;
      case "x^y":
        try {
          await backend.power(Number(input));
        } catch (err) {
          console.error("err power", err);
        }
        break;
      default:
        return;
    }
    setLoading(false);
    setInput("");
    if(e !== ""){
      setOperator(e);
    } else {
      setOperator("");
    }
    setCanisterCall(!canisterCall);
  };

  const reset = async () => {
    setWarningMessage(false);
    setLoadingText("Resetting...");
    setLoading(true);
    try {
      await backend.reset();
      setFirstInput("");
      setInput("");
      setOperator("");
      setLoading(false);
      setCanisterCall(!canisterCall);
    } catch (err) {
      console.error("err reset", err);
    }
  };

  // Motoko code
  // Get the current counter value
  const fetchCount = async () => {
    try {
      setLoading(true);
      const canisterCount = await backend.see();
      setCount(canisterCount); // Convert BigInt to number
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the count on page load
  useEffect(() => {
    fetchCount();
  }, [canisterCall]);

  useEffect(() => {
    setInput("");
    setOperator("");
  }, []);

  return (
    <div className="App">
      <div className="titles">
        <h1>
          <span className="greetingLetters">Hellooo </span>
          <span className="initialLetters">Moto</span>
          <span className="middleLetters">kalcu</span>
          <span className="finalLetters">lator</span>
        </h1>
      </div>
      <div className="itemsContainer">
        <div className="imagesContainer">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo vite" alt="React logo" />
          </a>
        </div>
        <div className='container'>
          { warningMessage && <p className="warningMessage">{ warningMessageText }</p> }
          <div className='wrapper'>
            <div className='screen'>
              <span>
                {"= "}
              </span>
              <span>
                { firstInput !== "" && operator === "" ? firstInput :
                    loading === true ? <span>
                      { `${loadingText} ` }
                      <CloudDownloadIcon fontSize='large' />
                    </span>
                    : 
                      operator === "√" ?
                        `${operator} ${count && count.toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2})}`
                        :
                        count && count.toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2})
                }
              </span>
              <span>
                {loading !== true && operator !== "√" && ` ${operator}`}
              </span>
              <span>
                {loading !== true && ` ${input}`}
              </span>
            </div>
            <div className='btn light-gray' onClick={reset}>
              AC
            </div>
            <div className='btn light-gray' onClick={()=>operatorType("x^y")}>
              x^y
            </div>
            <div className='btn light-gray' onClick={()=>operatorType("√")}>
              √x
            </div>
            <div className='btn orange' onClick={()=>operatorType("/")}>
              /
            </div>
            <div className='btn' onClick={()=>inputNum("7")}>
              7
            </div>
            <div className='btn' onClick={()=>inputNum("8")}>
              8
            </div>
            <div className='btn' onClick={()=>inputNum("9")}>
              9
            </div>
            <div className='btn orange' onClick={()=>operatorType("x")}>
              x
            </div>
            <div className='btn' onClick={()=>inputNum("4")}>
              4
            </div>
            <div className='btn' onClick={()=>inputNum("5")}>
              5
            </div>
            <div className='btn' onClick={()=>inputNum("6")}>
              6
            </div>
            <div className='btn orange' onClick={()=>operatorType("+")}>
              +
            </div>
            <div className='btn' onClick={()=>inputNum("1")}>
              1
            </div>
            <div className='btn' onClick={()=>inputNum("2")}>
              2
            </div>
            <div className='btn' onClick={()=>inputNum("3")}>
              3
            </div>
            <div className='btn orange' onClick={()=>operatorType("-")}>
              -
            </div>
            <div className='btn zero' onClick={()=>inputNum("0")}>
              0
            </div>
            <div className='btn' onClick={()=>inputNum("<")}>
              <BackspaceIcon/>
            </div>
            <div className='btn' onClick={()=>equals("")}>
              =
            </div>
          </div>
        </div>
        <div className="imagesContainer">
          <a
            href="https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/"
            target="_blank"
          >
            <span className="logo-stack">
              <img src={motokoLogo} className="logo motoko" alt="Motoko logo" />
            </span>
          </a>
          <a
            href="https://discordapp.com/users/Viktor19#9529/"
            target="_blank"
          >
            <span className="logo-stack">
              <img src={discordLogo} className="logo discord" alt="Motoko logo" />
            </span>
          </a>
        </div>
      </div>
      <div className="instructionsNotes">
        <h2>Notes:</h2>
        <p>- This application is in the testing stage, in case of error please report it to the development team by clicking on the discord logo.</p>
        <p>- Takes a while to initialize after entering the first value and the operator.</p>
        <p>- Once initialization is complete, you can input the other value to the operation and finally click on equal button (=) to optain the result.</p>
        <p>- Initializing, calculating and resetting stages may take about 2 seconds.</p>
      </div>
    </div>
  );
}

export default Calculator;

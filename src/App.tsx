import { useEffect, useState } from 'react';
import './App.css';
import motokoLogo from './assets/motoko_moving.png';
import motokoShadowLogo from './assets/motoko_shadow.png';
import reactLogo from './assets/react.svg';
import discordLogo from './assets/discord.jpg';
import { backend } from './declarations/backend';

function App() {
  const [count, setCount] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [input, setInput] = useState("");
  const [operator, setOperator] = useState("");
  const [canisterCall, setCanisterCall] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);

  const inputNum = async (e: string) => {
    if(count === 0){
      setLoadingText("Initializing...");
      setLoading(true);
      await backend.set(Number(e));
      setCanisterCall(!canisterCall);
      return setLoading(false);
    }
    if (e === "<"){
      setInput(input.slice(0, -1));
    } else {
      if(operator !== ""){
        setInput(input + e);
      } else {
        setWarningMessage(true);
      }
    }
  };

  const operatorType = (e: any) => {
    if(operator === ""){
      setOperator(e);
      setWarningMessage(false);
    }
  };

  const equals = async (e: any) => {
    if(!operator){
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
    setOperator("");
    setCanisterCall(!canisterCall);
  };

  const reset = async () => {
    setLoadingText("Resetting...");
    setLoading(true);
    try {
      await backend.reset();
      setInput("");
      setOperator("");
      setCanisterCall(!canisterCall);
      setLoading(false);
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
          <span className="initialLetters">Moto</span>
          <span className="middleLetters">kalcu</span>
          <span className="finalLetters">lator</span>
        </h1>
        <h5 className="versionLetters">Version: v0.0.1 Beta</h5>
      </div>
      <div className="itemsContainer">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a
            href="https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/"
            target="_blank"
          >
            <span className="logo-stack">
              <img
                src={motokoShadowLogo}
                className="logo motoko-shadow"
                alt="Motoko logo"
              />
              <img src={motokoLogo} className="logo motoko" alt="Motoko logo" />
            </span>
          </a>
          <a
            href="https://discordapp.com/channels/@me/Viktor19#9529/"
            target="_blank"
          >
            <span className="logo-stack">
              <img
                src={motokoShadowLogo}
                className="logo motoko-shadow"
                alt="Discord logo"
              />
              <img src={discordLogo} className="logo motoko" alt="Motoko logo" />
            </span>
          </a>
        </div>
        <div className='container'>
          <div className='wrapper'>
            <div className='screen'>
              <span>
                {"= "}
              </span>
              <span>
                { loading === true ? 
                  loadingText
                  : 
                    operator === "√" ?
                      `${operator} ${count && count.toFixed(2)}`
                      :
                      count && count.toFixed(2)
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
              √
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
              {"<-"}
            </div>
            <div className='btn' onClick={equals}>
              =
            </div>
          </div>
        </div>
      </div>
      { warningMessage && <p className="warningMessage">You should select an operator!</p> }
      <div className="instructionsNotes">
        <h2>Instructions:</h2>
        <p>- This application is in the testing stage, in case of error please contact the development team by clicking on the discord logo.</p>
        <p>- In this version, you must to set up a digit from 1 to 9 as a first value, then the calculator takes a while to initialize.</p>
        <p>- Once initialization is completed, you should select an operator, then input a value and finally click on equal button (=) to optain the operation result.</p>
        <p>- Initializing, calculating and resetting stages may take about 2 seconds.</p>
        <p>- Remember after initialization you can operate with multiple digits values.</p>
      </div>
    </div>
  );
}

export default App;

import Head from 'next/head';
import Keyboard from '../components/Keyboard';
import { Button, Progress } from 'react-daisyui';
import { useEffect, createRef, useState } from 'react';
import generateKeyboard from '../functions/generateKeyboard';

interface Racers {
  [peerId: string]: {
    name: string,
    currentIndex: number,
    wpm: number,
    accuracy?: number
  }  
}

export default function Home() {
  const inputRef = createRef<HTMLInputElement>();

  //typing functionality
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [prompt, setPrompt] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, ipsum sed cursus rhoncus, leo nulla eleifend lacus, a vehicula felis lacus eu ipsum.');
  
  //type mapping
  const [map, setMap] = useState(["a", "b", "c", "d", "e","f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
  const [scrambledMap, setScrambledMap] = useState<string[]>([]);
  const [latestChar, setLatestChar] = useState<string>("");
  
  //peer js stuff
  const [peerImp, setPeerImp] = useState(true);
  const [racers, setRacers] = useState<Racers>({});

  const newLayout = [];

  useEffect(() => {
    setScrambledMap(generateKeyboard());

    //import peerjs
    const fn = async () => {
      const PeerJs = (await import("peerjs")).default;

      const peer = new PeerJs();
      peer.on('open', (id) => {
        console.log(id);
      });

      peer.on("connection", async (conn) => {
        console.log("Connected to peer: ", conn.peer);
  
        // conn.on("open", () => {
        //   console.log(metaData);
        //   conn.send(metaData);
        // });
  
        // conn.on("data", (data) => {
        //   console.log("Received", data);
        //   onData(data);
        // });
      });

    };
    
    fn();
    focus();

    window.addEventListener("beforeunload", (ev) => 
    {  
      ev.preventDefault();
      return ev.returnValue = 'Are you sure you want to close?';
    });
  }, []);

  const focus = () => {
    inputRef.current.focus();
  }
  
  function onType(e) {
    let value = e.target.value;
    let alpha = /[a-zA-Z]/.test(value);
    let capital = value === value.toUpperCase();
    value = value.toLowerCase();
    let newValue = scrambledMap[map.indexOf(value)] || "";
    if (capital) {
      newValue = newValue.toUpperCase();
    }
    // for(let i = 0; i < map.length; i++) {
    //   if(value === map[i]) newValue = scrambledMap[i];
    // }


    setLatestChar(e.target.value);

    console.log(value, newValue, currentIndex);

    if ((alpha ? newValue : value) === prompt.charAt(currentIndex)){ 
      console.log('correct');
      setCurrentIndex(a => a+1);
    }
    setInputValue("");
  }


  return (
    <>
      <Head>
        <title>Shitracer</title>
        <meta name="description" content="typeracer but shit" />
      </Head>

      <main className="px-4 pb-4 pt-12 container max-w-4xl">
        <h1 className="text-3xl font-extrabold">
          <span className="mr-2.5">💩</span>Shitracer
        </h1>

        <div className="mt-4">
          You
          <Progress
            className="progress-accent"
            value={currentIndex}
            max={prompt.length}
          />
        </div>

        <p className="mt-4 text-lg ">
          <span className="text-green-500">
            {prompt.substring(0, currentIndex)}
          </span>
          <span className="h-4 w-1 bg-white inline-block animate-pulse-full opacity-0 rounded-sm"></span>
          <span>{prompt.substring(currentIndex)}</span>
        </p>

        {/* <div className="mt-4 text-center">
        <Button color = "success" className='btn mt-4  z-10' onClick={e => {
          setScrambledMap(generateKeyboard());
        }}>Start</Button>
      </div> */}


        
        <Keyboard currentCharacter={'a'} isCorrect={false} originalMap={map} scrambledMap={scrambledMap} />

        <div className="w-full flex justify-center">
          <Button className="cursor-pointer btn-success mt-4 z-10 absolute">
            Copy Link
          </Button>
        </div>

        <input
          className="opacity-0 absolute top-0 left-0 w-full h-full p-4 bg-stone-700 resize-none focus:outline-none text-2xl text-stone-400 font-mono"
          spellCheck="false"
          autoCapitalize="off"
          autoFocus={true}
          autoCorrect="off"
          autoComplete="off"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onType(e)}
        />
      </main>
    </>
  );
}

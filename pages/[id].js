import Head from 'next/head';
import Keyboard from '../components/Keyboard';
import { Button, Progress } from 'react-daisyui';
import { useEffect, createRef, useState } from 'react';
import generateKeyboard from '../functions/generateKeyboard';

export default function Home() {
  const inputRef = createRef<HTMLInputElement>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [map, setMap] = useState(["a", "b", "c", "d", "e","f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
  const [scrambledMap, setScrambledMap] = useState<string[]>([]);
  const [peerImp, setPeerImp] = useState(true);
  const [prompt, setPrompt] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, ipsum sed cursus rhoncus, leo nulla eleifend lacus, a vehicula felis lacus eu ipsum.');
  const [latestChar, setLatestChar] = useState<string>("");

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
    let newValue: string;
    for(let i = 0; i < map.length; i++) {
      if(value === map[i]) newValue = scrambledMap[i];
    }

    setLatestChar(e.target.value);

    console.log(value, newValue, currentIndex);

    if (value === prompt.charAt(currentIndex)){ 
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
          <span className="h-4 w-1 bg-white inline-block animate-pulse-full opacity-0"></span>
          <span>{prompt.substring(currentIndex)}</span>
        </p>

        {/* <div className="mt-4 text-center">
        <Button color = "success" className='btn mt-4  z-10' onClick={e => {
          setScrambledMap(generateKeyboard());
        }}>Start</Button>
      </div> */}

        <div
          className="flex justify-center gap-1 my-1 w-full"
          style={{ marginTop: "2rem" }}
        >
          <kbd className="kbd">q</kbd>
          <kbd className="kbd">w</kbd>
          <kbd className="kbd">e</kbd>
          <kbd className="kbd">r</kbd>
          <kbd className="kbd">t</kbd>
          <kbd className="kbd">y</kbd>
          <kbd className="kbd">u</kbd>
          <kbd className="kbd">i</kbd>
          <kbd className="kbd">o</kbd>
          <kbd className="kbd">p</kbd>
        </div>
        <div className="flex justify-center gap-1 my-1 w-full">
          <kbd className="kbd">a</kbd>
          <kbd className="kbd">s</kbd>
          <kbd className="kbd">d</kbd>
          <kbd className="kbd">f</kbd>
          <kbd className="kbd">g</kbd>
          <kbd className="kbd">h</kbd>
          <kbd className="kbd">j</kbd>
          <kbd className="kbd">k</kbd>
          <kbd className="kbd">l</kbd>
        </div>
        <div className="flex justify-center gap-1 my-1 w-full">
          <kbd className="kbd">z</kbd>
          <kbd className="kbd">x</kbd>
          <kbd className="kbd">c</kbd>
          <kbd className="kbd">v</kbd>
          <kbd className="kbd">b</kbd>
          <kbd className="kbd">n</kbd>
          <kbd className="kbd">m</kbd>
          <kbd className="kbd">/</kbd>
        </div>
        <Keyboard originalMap={map} scrambledMap={scrambledMap} />
        <div className="w-full flex justify-center">
          <Button className="cursor-pointer btn-success mt-4 z-10 absolute">
            Copy Link
          </Button>
        </div>

        <input
          className="opacity-0 absolute top-0 left-0 w-full h-full p-4 bg-stone-700 resize-none focus:outline-none text-2xl text-stone-400 font-mono"
          spellCheck="false"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onType(e)}
        />
      </main>
    </>
  );
}

import Head from 'next/head';
import Keyboard from '../components/Keyboard';
import { Button, Modal, Progress } from 'react-daisyui';
import { useEffect, createRef, useState, useRef } from 'react';
import generateKeyboard from '../functions/generateKeyboard';
import { DataConnection } from 'peerjs';
import WinnerView from '../components/WinnerView';
import toast, {Toaster} from "react-hot-toast";

interface Racers {
  [peerId: string]: Racer
}

interface Racer {
  name: string,
  currentIndex: number,
  wpm?: number,
  accuracy?: number
}

interface Conns {
  [peerId: string]: DataConnection
}

interface Data {
  type: string,
  content: any
}

export default function Home() {
  const inputRef = createRef<HTMLInputElement>();

  //typing functionality
  const [name, setName] = useState<string>("Host");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [prompt, setPrompt] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, ipsum sed cursus rhoncus, leo nulla eleifend lacus, a vehicula felis lacus eu ipsum.");
  const [usernameModalOpen, setUsernameModalOpen] = useState(true);
  
  //type mapping
  const [map, setMap] = useState(["a", "b", "c", "d", "e","f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
  const [scrambledMap, setScrambledMap] = useState<string[]>([]);
  const [latestChar, setLatestChar] = useState<string>("");

  //life cycle
  const [gamePhase, setGamePhase] = useState<string>("waiting"); // waiting, inProgress, end
  
  // p2p stuff
  const [peerId, setPeerId] = useState<string>();

  const [conns, _setConns] = useState<Conns>({});
  const connsRef = useRef(conns);
  const setConns = newConns => {
    connsRef.current = newConns;
    _setConns(newConns);
  }
  
  const [racers, _setRacers] = useState<Racers>({});
  const racersRef = useRef(racers);
  const setRacers = value => {
    racersRef.current = value;
    _setRacers(value);
  }

  useEffect(() => {
    const mapping = generateKeyboard();
    setScrambledMap(mapping);

    // p2p setup
    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer({
        host: "0.peerjs.com",
        port: 443,
        path: "/",
        pingInterval: 5000,
      });

      peer.on('open', () => {
        setPeerId(peer.id);
        console.log(`Peer opened! (${peer.id})`);
      });

      peer.on('connection', (conn) => {
        conn.on('open', () => {
          setConns({ ...connsRef.current, [conn.peer]: conn });
          console.log(`Incoming connection! (${conn.peer})`);

          conn.send({ type: "mapping", content: mapping });
          conn.send({ type: "gamePhase", content: gamePhase });
        });

        conn.on('data', (data:Data) => {
          const { type, content } = data;
          console.log(`Incoming data!`);

          switch (type) {
            case "racerUpdate":
              setRacers({ ...racersRef.current, [conn.peer]: content });
              break;
          }
        });
      });
    });

    focus();

    window.addEventListener("beforeunload", (ev) => 
    {  
      ev.preventDefault();
      return ev.returnValue = 'Are you sure you want to close?';
    });
  }, []);

  useEffect(() => {
    // broadcast racer data to all when change happens
    Object.keys(connsRef.current).forEach((key,i) => {
      const conn = connsRef.current[key];
      if (!conn.open) return;
      
      const { [key]:racerSelf, ...newRacers } = { ...racersRef.current, [peerId]: { name, currentIndex } };
      conn.send({ type: "racerBroadcast", content: newRacers });
    });

    // check if game end
    if (!Object.keys(racersRef.current).map((key,i) => racersRef.current[key].currentIndex >= prompt.length).some(a => a === false)) {
      Object.keys(connsRef.current).forEach((key,i) => {
        const conn = connsRef.current[key];
        if (!conn.open) return;
        
        conn.send({ type: "gamePhase", content: "end" });
      });
    }
  }, [currentIndex, racers]);

  function startGame() {
    Object.keys(connsRef.current).forEach((key,i) => {
      const conn = connsRef.current[key];
      if (!conn.open) return;
      
      setGamePhase("inProgress");
      conn.send({ type: "gamePhase", content: "inProgress" });
    });
  }

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
  
  const copy = () => {
    let val = `${process.env.NEXT_PUBLIC_URI}/${peerId}`;
    navigator.clipboard.writeText(val);
    toast("Link Copied to clipboard!");
  };

  return (
    <>
      <Head>
        <title>Shitracer</title>
        <meta name="description" content="typeracer but shit" />
      </Head>

      <Modal open={usernameModalOpen} className="bg-theme-surface">
        <Modal.Header>Please enter your name!</Modal.Header>
        <Modal.Body className="mt-4">
          <input
            className="focus:outline-none bg-slate-900 text-white rounded p-3 "
            //ref={usernameRef}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </Modal.Body>
        <Modal.Actions>
          <Button
            className={`${!name ? "btn-disabled" : ""}`}
            onClick={() => {
              if (name) {
                if (name.trim() !== "") {
                  setName(name);
                  setUsernameModalOpen(false);
                }
              }
            }}
          >
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
      <Toaster/>
      <main className="px-4 pb-4 pt-12 container max-w-4xl">
        <div className="flex justify-between">
          <h1 className="text-3xl font-extrabold">
            <span className="mr-2.5">💩</span>Shitracer
          </h1>
          <Button
            onClick={copy}
            className="cursor-pointer btn-primary z-10 text-lg"
          >
            Invite Others
          </Button>
        </div>
        <div className="py-8 flex flex-col gap-1">
          <div className="flex items-center gap-4 mt-4">
            <p className="w-20">{name} (me)</p>
            <Progress
              className="flex-grow progress-accent"
              value={currentIndex}
              max={prompt.length}
            />
          </div>
          {Object.keys(racersRef.current).map((key,i) =>
            <div className="flex items-center gap-4 mt-4" key={key}>
              <p className='w-20'>{racersRef.current[key].name}</p>
              <Progress
                className="flex-grow progress-accent"
                value={racersRef.current[key].currentIndex}
                max={prompt.length}
              />
            </div>
          )}
        </div>
     

        <p className="mt-4 text-lg ">
          <span className="text-green-500">
            {prompt.substring(0, currentIndex)}
          </span>
          <span className="h-4 w-1 bg-white inline-block animate-pulse-full opacity-0 rounded-sm"></span>
          <span>{prompt.substring(currentIndex)}</span>
        </p>


        {gamePhase === 'end' ? <WinnerView winnerName={undefined} wpm={undefined} /> : <Keyboard currentCharacter={latestChar} isCorrect={false} originalMap={map} scrambledMap={scrambledMap} />}

        <div className="w-full flex justify-center">
          <Button className="cursor-pointer btn-success mt-4 z-10 absolute" onClick={() => startGame()}>
            Start
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

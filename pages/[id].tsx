import Head from 'next/head';
import { useRouter } from 'next/router';
import Keyboard from '../components/Keyboard';
import { Button, Progress } from 'react-daisyui';
import { useEffect, createRef, useState, useRef } from 'react';
import { DataConnection } from 'peerjs';
import WinnerView from '../components/WinnerView';

interface Racers {
  [peerId: string]: Racer
}

interface Racer {
  name: string,
  currentIndex: number,
  wpm?: number,
  accuracy?: number
}

interface Data {
  type: string,
  content: any
}

export default function Home() {
  const router = useRouter();

  const inputRef = createRef<HTMLInputElement>();

  //typing functionality
  const [name, setName] = useState<string>("Guest");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [prompt, setPrompt] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, ipsum sed cursus rhoncus, leo nulla eleifend lacus, a vehicula felis lacus eu ipsum.');
  
  //type mapping
  const [map, setMap] = useState(["a", "b", "c", "d", "e","f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
  const [scrambledMap, setScrambledMap] = useState<string[]>([]);
  const [latestChar, setLatestChar] = useState<string>("");

  //life cycle
  const [gamePhase, setGamePhase] = useState<string>("waiting"); // waiting, inProgress, end
  
  //peer js stuff
  const [racers, _setRacers] = useState<Racers>({});
  const racersRef = useRef(racers);
  const setRacers = value => {
    racersRef.current = value;
    _setRacers(value);
  }

  // const [peerImp, setPeerImp] = useState(true);
  // const newLayout = [];

  // p2p states
  const [peerId, setPeerId] = useState<string>();
  const [connRef, setConnRef] = useState<DataConnection>();

  useEffect(() => {
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

        const conn = peer.connect(router.query.id as string);

        conn.on('open', () => {
          setConnRef(conn);
          console.log('Connected!');
        });

        conn.on('data', (data:Data) => {
          const { type, content } = data;
          console.log(`Incoming data!`);

          switch (type) {
            case "mapping":
              setScrambledMap(content);

              conn.send({ type: "racerUpdate", content: { name, currentIndex }});
              break;
            case "racerBroadcast":
              setRacers(content);
              console.log(content)
              break;
            case "gamePhase":
              setGamePhase(content);
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
  }, [router.query.id]);

  useEffect(() => {
    if (!connRef) return;
    connRef.send({ type: "racerUpdate", content: { name, currentIndex } });
  }, [currentIndex]);

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

        <div className="py-8 flex flex-col items-end gap-1">
          <div className="flex items-center gap-4 mt-4">
            <span>{name} (me)</span>
            <Progress
              className="w-[70vw] progress-accent"
              value={currentIndex}
              max={prompt.length}
            />
          </div>
          {Object.keys(racersRef.current).map((key,i) =>
            <div className="flex items-center gap-4 mt-4" key={key}>
              <span>{racersRef.current[key].name}</span>
              <Progress
                className="w-[70vw] progress-accent"
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

        {/* <div className="mt-4 text-center">
        <Button color = "success" className='btn mt-4  z-10' onClick={e => {
          setScrambledMap(generateKeyboard());
        }}>Start</Button>
      </div> */}


        
        {/* {gamePhase === 'end' ? <WinnerView /> : <Keyboard currentCharacter={'a'} isCorrect={false} originalMap={map} scrambledMap={scrambledMap} />} */}

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

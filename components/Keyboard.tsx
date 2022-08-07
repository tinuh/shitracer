import { useEffect } from 'react';

interface KeyboardProps {
	originalMap: Array<String>,
	scrambledMap: Array<String>,
	currentCharacter: String,
	isCorrect: Boolean,
}

const Keyboard:React.FC<KeyboardProps> = ({ originalMap, scrambledMap, currentCharacter }) => {


	useEffect(() => {
		
	}, [])

	return (
		<>
			<div
			className="flex justify-center gap-1 my-1 w-full"
			style={{ marginTop: "2rem" }}
			>
			{["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(
				(letter, key) => (
				<kbd className="kbd bg-black text-white" key={key}>
					{scrambledMap[originalMap.indexOf(letter)]}
				</kbd>
				)
			)}
			</div>
			<div className="flex justify-center gap-1 my-1 w-full">
			{["a", "s", "d", "f", "g", "h", "j", "k", "l"].map(

				(letter, key) => (
				<kbd className="kbd bg-black text-white" key={key}>
					{scrambledMap[originalMap.indexOf(letter)]}
				</kbd>
				)
			)}
			</div>
			<div className="flex justify-center gap-1 my-1 w-full">
			{["z", "x", "c", "v", "b", "n", "m"].map(
				(letter, key) => (
				<kbd className="kbd bg-black text-white" key={key}>
					{scrambledMap[originalMap.indexOf(letter)]}
				</kbd>
				)
			)}
			</div>
		</>
	)
}

export default Keyboard
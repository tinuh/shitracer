import { useEffect, useState } from 'react';

interface KeyboardProps {
	originalMap: Array<String>,
	scrambledMap: Array<String>,
	currentCharacter: String,
	isCorrect: Boolean,
}

const Keyboard:React.FC<KeyboardProps> = ({ originalMap, scrambledMap, currentCharacter, isCorrect }) => {

	const [showVisual, setShowVisual] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowVisual(false);
		}, 1000);
		setShowVisual(true);
	}, [currentCharacter])

	return (
		<>
			<div
			className="flex justify-center gap-1 my-1 w-full"
			style={{ marginTop: "2rem" }}
			>
			{["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(
				(letter, key) => (
					<span key = {key}>
				{showVisual && currentCharacter === letter && isCorrect ? 
					<kbd className="kbd bg-green-100 text-white " key={key}>
						{scrambledMap[originalMap.indexOf(letter)]}
					</kbd>
					:
					<kbd className="kbd bg-black text-white" key={key}>
						{scrambledMap[originalMap.indexOf(letter)]}
					</kbd>
				}
				</span>

				)
			)}
			</div>
			<div className="flex justify-center gap-1 my-1 w-full">
			{["a", "s", "d", "f", "g", "h", "j", "k", "l"].map(

				(letter, key) => (
					<span key = {key}>

					{showVisual && currentCharacter === letter && isCorrect ? 
						<kbd className="kbd bg-green-100 text-white " key={key}>
							{scrambledMap[originalMap.indexOf(letter)]}
						</kbd>
						:
						<kbd className="kbd bg-black text-white" key={key}>
							{scrambledMap[originalMap.indexOf(letter)]}
						</kbd>
					}
					</span>
				)
			)}
			</div>
			<div className="flex justify-center gap-1 my-1 w-full">
			{["z", "x", "c", "v", "b", "n", "m"].map(
				(letter, key) => (
					<span key = {key}>

					{showVisual && currentCharacter === letter && isCorrect ? 
						<kbd className="kbd bg-green-100 text-white " key={key}>
							{scrambledMap[originalMap.indexOf(letter)]}
						</kbd>
						:
						<kbd className="kbd bg-black text-white" key={key}>
							{scrambledMap[originalMap.indexOf(letter)]}
						</kbd>
					}
					</span>
				)
			)}
			</div>
		</>
	)
}

export default Keyboard
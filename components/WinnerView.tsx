

interface WinnerViewProps {
    winnerName: String,
    wpm: Number,
    
}

const WinnerView:React.FC<WinnerViewProps> = ({ winnerName, wpm }) => {
    return (
        <div className="w-full flex justify-center">
            <h1 className="">{winnerName} won with {wpm} WPM LOL</h1>
        </div>
    )
}

export default WinnerView;

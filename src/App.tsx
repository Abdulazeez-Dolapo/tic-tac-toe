import { FC, MouseEvent, useState } from "react"
import "./App.css"

type BoardType = string[]

const Box: FC<{
	value: string
	handleClick: (e: MouseEvent<HTMLButtonElement>) => void
	disableClick: boolean
}> = ({ value, handleClick, disableClick }) => (
	<button className="box" onClick={handleClick} disabled={disableClick}>
		{value}
	</button>
)

const GameControls: FC<{
	text: string
	startNewGame: (e: MouseEvent<HTMLButtonElement>) => void
	undoLastMove: (e: MouseEvent<HTMLButtonElement>) => void
	disableUndo: boolean
}> = ({ text, startNewGame, undoLastMove, disableUndo }) => {
	return (
		<div>
			{text ? <p>{text}</p> : null}

			<div>
				<button onClick={startNewGame}>Start new game</button>
				<button onClick={undoLastMove} disabled={disableUndo}>
					Undo Last Move
				</button>
			</div>
		</div>
	)
}

const initialBoardState: BoardType = Array(9).fill("")

function App() {
	const [counter, setCounter] = useState(0)
	const [boardState, setBoardState] = useState(initialBoardState)
	const [winningText, setWinningText] = useState("")
	const [isGameOver, setIsGameOver] = useState(false)
	const [boardStateHistory, setBoardStateHistory] = useState([
		initialBoardState,
	])

	const isPlayerOne = () => counter % 2 === 0

	const onBoxClick = (idx: number) => {
		const newBoardState = boardState.map((item, index) => {
			if (idx === index) item = isPlayerOne() ? "X" : "O"

			return item
		})
		const newCounter = counter + 1

		setBoardState(newBoardState)
		setCounter(newCounter)
		updateHistory(newBoardState, newCounter)

		const isWinner = calculateWinner(newBoardState)
		if (isWinner) {
			setIsGameOver(true)
			setWinningText(
				`Player ${isPlayerOne() ? "one" : "two"} has won the game`
			)
		}
	}

	const updateHistory = (currentBoardState: BoardType, index: number) => {
		const newHistory = [...boardStateHistory]
		newHistory[index] = currentBoardState

		setBoardStateHistory(newHistory)
	}

	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	const calculateWinner = (currentBoardState: BoardType) => {
		let isWinner = false

		for (let i = 0; i < winningCombinations.length; i++) {
			const [a, b, c] = winningCombinations[i]

			isWinner =
				!!currentBoardState[a] &&
				currentBoardState[a] === currentBoardState[b] &&
				currentBoardState[a] === currentBoardState[c]

			if (isWinner) break
		}

		return isWinner
	}

	const resetAppState = () => {
		setCounter(0)
		setBoardState(initialBoardState)
		setBoardStateHistory([initialBoardState])
		setWinningText("")
		setIsGameOver(false)
	}

	const undoLastMove = () => {
		const newCounter = counter - 1
		setCounter(newCounter)
		setBoardState(boardStateHistory[newCounter])
		setWinningText("")
		setIsGameOver(false)
	}

	return (
		<div className="wrapper">
			<div className="container">
				{[0, 1, 2].map(rowIndex => (
					<div className="row" key={rowIndex}>
						{[0, 1, 2].map(colIndex => {
							const boxIndex = rowIndex * 3 + colIndex

							return (
								<Box
									key={boxIndex}
									value={boardState[boxIndex]}
									handleClick={() => onBoxClick(boxIndex)}
									disableClick={isGameOver}
								/>
							)
						})}
					</div>
				))}
			</div>

			<GameControls
				text={winningText}
				startNewGame={resetAppState}
				undoLastMove={undoLastMove}
				disableUndo={counter < 1}
			/>
		</div>
	)
}

export default App

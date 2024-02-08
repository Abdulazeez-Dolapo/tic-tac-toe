import { FC, MouseEvent, useState } from "react"
import "./App.css"

const Box: FC<{
	value: string
	handleClick: (e: MouseEvent<HTMLButtonElement>) => void
}> = ({ value, handleClick }) => {
	return (
		<button className="box" onClick={handleClick}>
			{value}
		</button>
	)
}

const initialBoardState: string[] = Array(9).fill("")
function App() {
	const [boardState, setBoardState] = useState(initialBoardState)
	const [counter, setCounter] = useState(0)

	const onBoxClick = (idx: number) => {
		const newBoardState = boardState.map((item, index) => {
			if (idx === index) item = counter % 2 === 0 ? "X" : "O"

			return item
		})

		setBoardState(newBoardState)
		setCounter(count => count + 1)
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
								/>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}

export default App

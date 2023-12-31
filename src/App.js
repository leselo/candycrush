import { useEffect, useState } from "react";
import "./App.css";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";
import { useLockedBody } from "usehooks-ts";

const candyColors = [
	blueCandy,
	orangeCandy,
	purpleCandy,
	redCandy,
	yellowCandy,
	greenCandy,
];

const numberOfCandiesPerRow = 8;
const minCellsToMatch = 3;
const emptyCellColor = blank;

export default function App() {
	const [gameArea, setGameArea] = useState(360);
	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
	const [cellsToMatch, setCellsToMatch] = useState(minCellsToMatch);
	const [cellBeingDragged, setCellBeingDragged] = useState();
	const [cellBeingReplaced, setCellBeingReplaced] = useState();
	const [totalSolutions, setTotalSolutions] = useState(0);
	const [totalMoves, setTotalMoves] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [keepSearching, setKeepSearching] = useState(false);
	const [gameX, setGameX] = useState(0);
	const [gameY, setGameY] = useState(0);
	const [imgBeingDragged, setImgBeingDragged] = useState(blank);
	const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });
	const [imgHidden, setImgHidden] = useState("");
	const [locked, setLocked] = useLockedBody(false, "root");
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);
	const width = numberOfCandiesPerRow;
	const height = numberOfCandiesPerRow;
	const imgWidth = gameArea / width;
	const imgHeight = gameArea / height;
	const draggedImgWidth = imgWidth * 2;
	const draggedImgHeight = imgHeight * 2;

	const [movedID, setMovedID] = useState(0);

	const toggleLocked = () => {
		setLocked(!locked);
	};

	const createBoard = () => {
		const boardColors = [];
		for (let n = 0; n < width * height; n++) {
			/* if (n === 56 || n === 57 || n === 59 || n === 60 || n === 50) {
				boardColors.push(candyColors[3]);
			} else if (n === 123 || n === 124 || n === 125) {
				boardColors.push(candyColors[2]);
			} else { */
			boardColors.push(
				candyColors[Math.floor(Math.random() * candyColors.length)]
			);
			//}
		}
		setCurrentColorArrangement(boardColors);
	};

	const checkHorizontal = (isReplace) => {
		let retValue = false;
		let testCells = [];
		let columnPerLine = 0;
		for (let cellID = 0; cellID < currentColorArrangement.length; cellID++) {
			if (true) {
				for (
					let maxTestCells = width - 1 - columnPerLine;
					maxTestCells >= 0;
					maxTestCells--
				) {
					testCells = [];
					if (maxTestCells >= cellsToMatch - 1) {
						for (let testCellID = 0; testCellID <= maxTestCells; testCellID++) {
							testCells.push(cellID + testCellID);
						}
					}
					if (
						testCells.every(
							(cell) =>
								currentColorArrangement[cell] ===
									currentColorArrangement[cellID] &&
								// eslint-disable-next-line eqeqeq
								currentColorArrangement[cell] != emptyCellColor
						)
					) {
						// eslint-disable-next-line no-loop-func
						testCells.forEach((cell) => {
							if (isReplace) {
								currentColorArrangement[cell] = emptyCellColor;
								setTotalScore(totalScore + Math.pow(testCells.length, 4));
							}

							retValue = true;
						});
					}
				}
			}
			columnPerLine++;
			if (columnPerLine > width - 1) columnPerLine = 0;
		}
		return retValue;
	};

	const checkVertical = (isReplace) => {
		let retValue = false;
		let testCells = [];
		let rowPerLine = 0;

		for (let cellID = 0; cellID < currentColorArrangement.length; cellID++) {
			if (true) {
				for (let maxTestCells = height - 1; maxTestCells >= 0; maxTestCells--) {
					testCells = [];
					if (maxTestCells >= cellsToMatch - 1) {
						for (let testCellID = 0; testCellID <= maxTestCells; testCellID++) {
							testCells.push(cellID + height * testCellID);
						}
					}

					if (
						testCells.every(
							(cell) =>
								currentColorArrangement[cell] ===
								currentColorArrangement[cellID]
						)
					) {
						// eslint-disable-next-line no-loop-func
						testCells.forEach((cell) => {
							if (isReplace) {
								currentColorArrangement[cell] = emptyCellColor;
								setKeepSearching(!keepSearching);
								setTotalScore(totalScore + testCells.length * 2);
							}
							retValue = true;
						});
					}
				}
			}
			rowPerLine++;
			if (rowPerLine > height - 1) rowPerLine = 0;
		}
		return retValue;
	};

	const findSoulutions = () => {
		var rightEdge = 0;
		const threeValues = [];
		var debugShowHorizontal = true;
		var debugShowVertical = true;
		var isDirty = false;
		var solutions = 0;
		for (let cellID = 0; cellID < currentColorArrangement.length; cellID++) {
			document.getElementById(cellID).style.opacity = 1;
			document.getElementById(cellID).style.background = "white";
			//console.log("find Clue");

			const candyColorToMatch = currentColorArrangement[cellID];
			if (cellID % width === 0) rightEdge = cellID + width - 1;

			if (
				debugShowHorizontal &&
				// horizontal match
				//cellID < rightEdge - 1 &&
				currentColorArrangement[cellID + 1] === candyColorToMatch &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				// eslint-disable-next-line eqeqeq
				currentColorArrangement[cellID] != emptyCellColor
			) {
				if (true) {
					if (
						// right and up
						cellID < rightEdge - 1 &&
						currentColorArrangement[cellID + 2 - height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID + 2 - height);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("1:", cellID, cellID + 1, cellID + 2 - height);
					}
					if (
						// right and down
						cellID < rightEdge - 1 &&
						currentColorArrangement[cellID + 2 + height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID + 2 + height);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("2:", cellID, cellID + 1, cellID + 2 + height);
					}
					if (
						// right and middle
						currentColorArrangement[cellID + 3] === candyColorToMatch &&
						cellID < rightEdge - 2
					) {
						threeValues.push(cellID, cellID + 1, cellID + 3);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("3:", cellID, cellID + 1, cellID + 3);
					}
					if (
						//left and up
						cellID < rightEdge &&
						cellID > rightEdge - 6 &&
						currentColorArrangement[cellID - 1 - height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 1 - height);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("4:", cellID, cellID + 1, cellID - 1 - height);
					}
					if (
						//left and down
						cellID > rightEdge - 6 &&
						cellID < rightEdge &&
						currentColorArrangement[cellID - 1 + height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 1 + height);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("5:", cellID, cellID + 1, cellID - 1 + height);
					}
					if (
						//left and middle
						cellID > rightEdge - 6 &&
						cellID < rightEdge &&
						currentColorArrangement[cellID - 2] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 2);
						isDirty = true;
						setTotalSolutions(solutions++);
						//console.log("6:", cellID, cellID + 1, cellID - 2);
					}
				}
			}
			if (
				debugShowHorizontal &&
				cellID >= rightEdge - width - 1 &&
				cellID + 2 <= rightEdge &&
				currentColorArrangement[cellID + 2] === candyColorToMatch &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				// eslint-disable-next-line eqeqeq
				currentColorArrangement[cellID] != emptyCellColor
			) {
				if (
					cellID + 1 - height > 0 &&
					currentColorArrangement[cellID + 1 - height] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + 2, cellID + 1 - height);
					isDirty = true;
					setTotalSolutions(solutions++);
					//console.log("7:", cellID, cellID + 2, cellID + 1 - height);
				}
				if (
					cellID + 1 + height < currentColorArrangement.length &&
					currentColorArrangement[cellID + 1 + height] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + 2, cellID + 1 + height);
					isDirty = true;
					setTotalSolutions(solutions++);
					//console.log("8:", cellID, cellID + 2, cellID + 1 + height);
				}
			}

			//Veritcal matches missing top or bottom
			if (
				debugShowVertical &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				currentColorArrangement[cellID - height] === candyColorToMatch
			) {
				if (
					cellID > rightEdge - (width - 1) &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID - height * 2 - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID - height * 2 - 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					currentColorArrangement[cellID - height * 3] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID - height * 3);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					cellID < rightEdge &&
					currentColorArrangement[cellID - height * 2 + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID - height * 2 + 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					cellID > rightEdge - (width - 1) &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID + height - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID + height - 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					currentColorArrangement[cellID + height * 2] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID + height * 2);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					cellID < rightEdge &&
					currentColorArrangement[cellID + height + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height, cellID + height + 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
			}

			//Vertical match missing one in the middle
			if (
				debugShowVertical &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				currentColorArrangement[cellID - height * 2] === candyColorToMatch
			) {
				if (
					cellID > rightEdge - (width - 1) &&
					currentColorArrangement[cellID - height - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height * 2, cellID - height - 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
				if (
					cellID < rightEdge &&
					currentColorArrangement[cellID - height + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID - height * 2, cellID - height + 1);
					isDirty = true;
					setTotalSolutions(solutions++);
				}
			}

			threeValues.map((cellIDValue) => {
				document.getElementById(cellIDValue).style.opacity = 0.4;
				//document.getElementById(cellIDValue).style.background = "lightyellow";
				return true;
			});
		}
		return isDirty;
	};

	const gravityPull = () => {
		for (let topLine = 0; topLine < width; topLine++) {
			if (currentColorArrangement[topLine] === emptyCellColor) {
				currentColorArrangement[topLine] =
					candyColors[Math.floor(Math.random() * candyColors.length)];

				setKeepSearching(!keepSearching);
			}
		}

		for (let cellID = 0; cellID < currentColorArrangement.length; cellID++) {
			if (currentColorArrangement[cellID + width] === emptyCellColor) {
				//console.log("cellID: " + cellID);
				currentColorArrangement[cellID + width] =
					currentColorArrangement[cellID];
				currentColorArrangement[cellID] = emptyCellColor;
				setKeepSearching(!keepSearching);
				//setTotalScore(totalScore + 1);
				console.log("Done...!");
			}
			//
			if (
				currentColorArrangement.every(
					(item, num) => currentColorArrangement[num] != emptyCellColor
				)
			) {
				//console.log("Done...!");
				//cellID is only to keep search active all the way through
				setKeepSearching(true);
				//setSearchClue(true);
			}
		}
	};

	const cellDragStart = (e) => {
		setCellBeingDragged(e.target);
		//console.log("start: ", e.target);
	};

	const cellDragDrop = (e) => {
		setCellBeingReplaced(e.target);
		//console.log("drop: ", e.target);
		//console.log(document.getElementById("12"));
	};

	const cellDragEnd = () => {
		//console.log("end: ", e.target);
		try {
			const cellBeingDraggedId = parseInt(
				cellBeingDragged.getAttribute("data-id")
			);
			const cellBeingReplacedId = parseInt(
				cellBeingReplaced.getAttribute("data-id")
			);

			currentColorArrangement[cellBeingReplacedId] =
				cellBeingDragged.getAttribute("src");
			currentColorArrangement[cellBeingDraggedId] =
				cellBeingReplaced.getAttribute("src");

			const validPositions = [
				cellBeingDraggedId - 1,
				cellBeingDraggedId + 1,
				cellBeingDraggedId - width,
				cellBeingDraggedId + width,
			];

			const valitPosition = validPositions.includes(cellBeingReplacedId);

			const isValidHorizontal = checkHorizontal(false);
			const isValidVertical = checkVertical(false);

			if (valitPosition && (isValidHorizontal || isValidVertical)) {
				console.log("-----------------------OK------------------------");
				setKeepSearching(!keepSearching);
				setCellBeingDragged(null);
				setCellBeingReplaced(null);
				setTotalMoves(totalMoves + 1);
			} else {
				console.log("NOT OK");
				currentColorArrangement[cellBeingReplacedId] =
					cellBeingReplaced.getAttribute("src");
				currentColorArrangement[cellBeingDraggedId] =
					cellBeingDragged.getAttribute("src");
				//setCurrentColorArrangement([...currentColorArrangement]);
			}
		} catch (e) {}
		//
	};

	const handleTouchStart = (e) => {
		var touchedImageX = document
			.getElementById(e.target.id)
			.getBoundingClientRect().x;
		var touchedImageY = document
			.getElementById(e.target.id)
			.getBoundingClientRect().y;

		setDeltaX(Math.floor(Math.floor(e.touches[0].clientX)) - touchedImageX);
		setDeltaY(Math.floor(Math.floor(e.touches[0].clientY)) - touchedImageY);

		var posX = touchedImageX - imgWidth / 2;
		var posY = touchedImageY - imgHeight / 2;

		setImgPosition({
			x: posX,
			y: posY,
		});

		setImgHidden("");
		setImgBeingDragged(e.target.src);
		cellDragStart(e);

		//setItems((prevItems) => prevItems.map((item, i) => (i === index ? { ...item, touchStart: touch.clientX } : item)));
	};
	const handleTouchMove = (e) => {
		const touchPositionX = e.touches[0].clientX - gameX;
		const touchPositionY = e.touches[0].clientY - gameY;

		var numberInCol = Math.floor(touchPositionX / imgWidth);
		if (numberInCol === touchPositionX / imgWidth)
			numberInCol = numberInCol - 1;

		var numberInRow = Math.floor(touchPositionY / imgHeight);
		if (numberInRow === touchPositionY / imgHeight)
			numberInRow = numberInRow - 1;

		var movedImageId = numberInRow * numberOfCandiesPerRow + numberInCol;

		if (
			numberInCol >= 0 &&
			numberInCol <= width - 1 &&
			numberInRow >= 0 &&
			numberInRow <= height - 1
		) {
			setMovedID(movedImageId);
			var movedImageX = document
				.getElementById(movedImageId)
				.getBoundingClientRect().x;
			var movedImageY = document
				.getElementById(movedImageId)
				.getBoundingClientRect().y;

			var posX = movedImageX - imgWidth / 2;
			var posY = movedImageY - imgHeight / 2;

			setImgPosition({
				x: posX,
				y: posY,
			});

			setCellBeingReplaced(document.getElementById(movedImageId));
		}
	};

	const handleTouchEnd = () => {
		setImgHidden("true");
		cellDragEnd();
	};
	const handleTouchCancel = (e) => {
		setImgHidden("true");
	};
	useEffect(() => {
		toggleLocked();
		createBoard();
		window.addEventListener("resize", function (event) {
			getScreenOrientation();
		});

		var screenWidth = Math.floor(
			(window.innerWidth - 4) / numberOfCandiesPerRow
		);
		setGameArea(screenWidth * numberOfCandiesPerRow);

		const gameDiv = document.getElementById("game");
		gameDiv.style.width = gameArea;
		setGameX(gameDiv.getBoundingClientRect().x);
		setGameY(gameDiv.getBoundingClientRect().y);
		return () => {
			window.removeEventListener("resize", function (event) {});
		};
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			checkHorizontal(true);
			checkVertical(true);
			gravityPull();

			setCurrentColorArrangement([...currentColorArrangement]);
		}, 100);

		return () => clearInterval(timer);
	}, [currentColorArrangement]);

	useEffect(() => {
		//console.log("useEffect:" + keepSearching);

		const timer = setTimeout(() => {
			//console.log("timer");
			//findSoulutions();
		}, 1000);

		//return () => clearInterval(timer);
	}, [keepSearching]);
	//console.log(currentColorArrangement);

	function getScreenOrientation() {
		window.location.reload(false);
	}

	return (
		<div className="app">
			<div id="game" className="game">
				{currentColorArrangement.map((candyColor, idx) => (
					<img
						src={candyColor}
						draggable={true}
						onDragStart={cellDragStart}
						onDrop={cellDragDrop}
						onDragEnd={cellDragEnd}
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={(e) => e.preventDefault()}
						onDragLeave={(e) => e.preventDefault()}
						alt={candyColor}
						data-id={idx}
						key={idx}
						id={idx}
						width={imgWidth}
						height={imgHeight}
						onTouchStart={(e) => handleTouchStart(e)}
						onTouchMove={(e) => handleTouchMove(e)}
						onTouchEnd={() => handleTouchEnd()}
						onTouchCancel={(e) => handleTouchCancel(e)}
					/>
				))}
				<img
					style={{
						position: "absolute",
						top: imgPosition.y,
						left: imgPosition.x,
					}}
					src={imgBeingDragged}
					width={draggedImgWidth}
					height={draggedImgHeight}
					alt={imgBeingDragged}
					hidden={imgHidden}
				/>

				<div className="scoreboard">
					<div className="spacer"></div>
					<div className="scoreboards">Moves:</div>
					<div className="scoreboardres">{totalMoves}</div>
					<div className="spacer"></div>
				</div>

				<div className="scoreboard">
					<div className="spacer"></div>
					<div className="scoreboards">Score:</div>
					<div className="scoreboardres">{totalScore}</div>
					<div className="spacer"></div>
				</div>

				<div className="scoreboard">
					<div className="spacer"></div>
					<div className="scoreboards">Efficency:</div>

					<div className="scoreboardres">
						{parseInt((totalScore + 1) / (totalMoves + 1))}
					</div>
					<div className="spacer"></div>
				</div>
				<div
					style={{
						display: "inline",
						backgroundColor: "yellow",
						width: "100%",
						fontSize: "0.74em",
						padding: "1px",
					}}
				>
					<p align="center">
						Drag and drop one candy one step horizontally or vertically to match
						3 or more candies. More matched candies give more points.
					</p>
				</div>
				<div
					style={{
						textAlign: "center",
						opacity: ".5",
						position: "sticky",
						padding: "1px",
					}}
				>
					<br />
					Developed by Laszlo Elo 2023 - Enjoy
				</div>
			</div>
		</div>
	);
}

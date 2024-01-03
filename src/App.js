import { useEffect, useRef, useState } from "react";
import "./App.css";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";
import { useLockedBody } from "usehooks-ts";
import { useLockBodyScroll } from "@uidotdev/usehooks";

const candyColors = [
	blueCandy,
	orangeCandy,
	purpleCandy,
	redCandy,
	yellowCandy,
	greenCandy,
];

const candiesPerRow = 4;
const minCellsToMatch = 3;
const emptyCellColor = blank;

export default function App() {
	useLockBodyScroll();
	/* localStorage.removeItem("totalMoves");
	localStorage.removeItem("numberOfCandiesPerRow");
	localStorage.removeItem("totalScore"); */

	var numberOfCandiesPerRowLoad = parseInt(
		localStorage.getItem("numberOfCandiesPerRow") || candiesPerRow
	);
	var totalMovesLoad = parseInt(localStorage.getItem("totalMoves", 0));
	var totalScoreLoad = parseInt(localStorage.getItem("totalScore", 0));

	isNaN(numberOfCandiesPerRowLoad) &&
		(numberOfCandiesPerRowLoad = candiesPerRow);
	isNaN(totalMovesLoad) && (totalMovesLoad = 0);
	isNaN(totalScoreLoad) && (totalScoreLoad = 0);

	const [numberOfCandiesPerRow, setNumberOfCandiesPerRow] = useState(
		numberOfCandiesPerRowLoad
	);

	const [txtTemp, setTxtTemp] = useState("-");
	const numberOfElementsPerRow = useRef(candiesPerRow);
	const [gameArea, setGameArea] = useState(360);
	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
	const [cellsToMatch, setCellsToMatch] = useState(minCellsToMatch);
	const [cellBeingDragged, setCellBeingDragged] = useState();
	const [cellBeingReplaced, setCellBeingReplaced] = useState();
	const [totalSolutions, setTotalSolutions] = useState(73);
	const [totalMoves, setTotalMoves] = useState(totalMovesLoad);
	const [totalScore, setTotalScore] = useState(totalScoreLoad);
	const [keepSearching, setKeepSearching] = useState(false);
	const [gameX, setGameX] = useState(0);
	const [gameY, setGameY] = useState(0);
	const [imgBeingDragged, setImgBeingDragged] = useState(blank);
	const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });
	const [imgHidden, setImgHidden] = useState("");
	const [locked, setLocked] = useLockedBody(false, "root");
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);

	const [width, setWidth] = useState(numberOfCandiesPerRow);
	const [height, setHeight] = useState(numberOfCandiesPerRow);
	const [imgWidth, setImgWidth] = useState(gameArea / width);
	const [imgHeight, setImgHeight] = useState(gameArea / height);
	const [draggedImgWidth, setDraggedImgWidth] = useState(imgWidth * 2);
	const [draggedImgHeight, setDraggedImgHeight] = useState(imgHeight * 2);
	const [isVisible, setIsVisible] = useState(false);
	const threeValues = [];
	const [movedID, setMovedID] = useState(0);

	const toggleLocked = () => {
		setLocked(!locked);
	};

	const createBoard = () => {
		var screenWidth = Math.floor(
			(window.innerWidth - 4) / numberOfCandiesPerRow
		);
		setGameArea(screenWidth * numberOfCandiesPerRow); //

		const gameDiv = document.getElementById("game");
		gameDiv.style.width = gameArea;
		setGameX(gameDiv.getBoundingClientRect().x);
		setGameY(gameDiv.getBoundingClientRect().y);

		setImgWidth(gameArea / width);
		setImgHeight(gameArea / height);
		setDraggedImgWidth(imgWidth * 2);
		setDraggedImgHeight(imgHeight * 2);

		//console.log(">>>", numberOfCandiesPerRow);
		//setTxtTemp(imgWidth + ":" + gameArea + ":" + numberOfCandiesPerRow + ":");

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

	const findSoulutions = (showThem) => {
		var rightEdge = 0;
		var leftEdge = 0;

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
			leftEdge = rightEdge - width + 1;
			//console.log(leftEdge, "rightEdge", rightEdge);

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
						cellID >= leftEdge &&
						currentColorArrangement[cellID + 2 - height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID + 2 - height);
						isDirty = true;
						solutions++;
						console.log("1:", cellID, cellID + 1, cellID + 2 - height);
					}
					if (
						// right and down
						cellID < rightEdge - 1 &&
						cellID >= leftEdge &&
						currentColorArrangement[cellID + 2 + height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID + 2 + height);
						isDirty = true;
						solutions++;
						console.log("2:", cellID, cellID + 1, cellID + 2 + height);
					}
					if (
						// right and middle
						currentColorArrangement[cellID + 3] === candyColorToMatch &&
						cellID < rightEdge - 2 &&
						cellID >= leftEdge
					) {
						threeValues.push(cellID, cellID + 1, cellID + 3);
						isDirty = true;
						solutions++;
						console.log("3:", cellID, cellID + 1, cellID + 3);
					}
					if (
						//left and up
						cellID < rightEdge &&
						cellID > leftEdge &&
						currentColorArrangement[cellID - 1 - height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 1 - height);
						isDirty = true;
						solutions++;
						console.log("4:", cellID, cellID + 1, cellID - 1 - height);
					}
					if (
						//left and down
						cellID > leftEdge &&
						cellID < rightEdge &&
						currentColorArrangement[cellID - 1 + height] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 1 + height);
						isDirty = true;
						solutions++;
						console.log("5:", cellID, cellID + 1, cellID - 1 + height);
					}
					if (
						//left and middle
						cellID > leftEdge + 1 &&
						cellID < rightEdge &&
						currentColorArrangement[cellID - 2] === candyColorToMatch
					) {
						threeValues.push(cellID, cellID + 1, cellID - 2);
						isDirty = true;
						solutions++;
						console.log("6:", cellID, cellID + 1, cellID - 2);
					}
				}
			}
			if (
				//Horizontal middle above or under
				debugShowHorizontal &&
				cellID >= leftEdge &&
				cellID < rightEdge - 1 &&
				currentColorArrangement[cellID + 2] === candyColorToMatch &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				// eslint-disable-next-line eqeqeq
				currentColorArrangement[cellID] != emptyCellColor
			) {
				if (
					//above
					cellID + 1 - height > 0 &&
					currentColorArrangement[cellID + 1 - height] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + 2, cellID + 1 - height);
					isDirty = true;
					solutions++;
					console.log("7:", cellID, cellID + 2, cellID + 1 - height);
				}
				if (
					//under
					cellID + 1 + height < currentColorArrangement.length &&
					currentColorArrangement[cellID + 1 + height] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + 2, cellID + 1 + height);
					isDirty = true;
					solutions++;
					console.log("8:", cellID, cellID + 2, cellID + 1 + height);
				}
			}

			//Veritcal matches missing top or bottom
			if (
				debugShowVertical &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				currentColorArrangement[cellID + height] === candyColorToMatch
			) {
				if (
					//top and left
					cellID > leftEdge &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID - height - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID - height - 1);
					isDirty = true;
					solutions++;
					console.log("9:", cellID, cellID + height, cellID - height - 1);
				}
				if (
					// Top and right
					cellID >= leftEdge &&
					cellID < rightEdge &&
					currentColorArrangement[cellID - height + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID - height + 1);
					isDirty = true;
					solutions++;
					console.log("10:", cellID, cellID + height, cellID - height + 1);
				}
				if (
					// Top and middle
					cellID >= leftEdge &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID - height * 2] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID - height * 2);
					isDirty = true;
					solutions++;
					console.log("11:", cellID, cellID + height, cellID - height * 2);
				}
				if (
					// bottom and left
					cellID > leftEdge &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID + height * 2 - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID + height * 2 - 1);
					isDirty = true;
					solutions++;
					console.log("12:", cellID, cellID + height, cellID + height * 2 - 1);
				}
				if (
					// bottom and right
					cellID >= leftEdge &&
					cellID < rightEdge &&
					currentColorArrangement[cellID + height * 2 + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID + height * 2 + 1);
					isDirty = true;
					solutions++;
					console.log("13:", cellID, cellID + height, cellID + height * 2 + 1);
				}
				if (
					// bottom and middle
					cellID >= leftEdge &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID + height * 3] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height, cellID + height * 3);
					isDirty = true;
					solutions++;
					console.log("14:", cellID, cellID + height, cellID + height * 3);
				}
			}

			//Vertical match missing one in the middle
			if (
				debugShowVertical &&
				currentColorArrangement[cellID] === candyColorToMatch &&
				currentColorArrangement[cellID + height * 2] === candyColorToMatch
			) {
				if (
					//middle and left
					cellID > leftEdge &&
					cellID <= rightEdge &&
					currentColorArrangement[cellID + height - 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height * 2, cellID + height - 1);
					isDirty = true;
					solutions++;
					console.log("15:", cellID, cellID + height * 2, cellID + height - 1);
				}
				if (
					//middle and right
					cellID >= leftEdge &&
					cellID < rightEdge &&
					currentColorArrangement[cellID + height + 1] === candyColorToMatch
				) {
					threeValues.push(cellID, cellID + height * 2, cellID + height + 1);
					isDirty = true;
					solutions++;
					console.log("16:", cellID, cellID + height * 2, cellID + height + 1);
				}
			}

			threeValues.map((cellIDValue) => {
				if (showThem) document.getElementById(cellIDValue).style.opacity = 0.4;
				//document.getElementById(cellIDValue).style.background = "lightyellow";
				return true;
			});
		}

		//console.log("solutions:" + solutions);

		setTotalSolutions(solutions);
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

				console.log("Done...!", totalSolutions);
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
		e.preventDefault();
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
		e.preventDefault();
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

	const handleTouchEnd = (e) => {
		e.preventDefault();
		setImgHidden("true");
		cellDragEnd();
	};
	const handleTouchCancel = (e) => {
		e.preventDefault();
		setImgHidden("true");
	};

	const handleTouchStartOver = (resetToDefault) => {
		var resetNumber = numberOfCandiesPerRow;
		if (resetToDefault) {
			resetNumber = candiesPerRow;

			localStorage.setItem("totalMoves", parseInt(0));
			localStorage.setItem("totalScore", parseInt(0));
		} else {
			localStorage.setItem("totalMoves", parseInt(totalMoves));
			localStorage.setItem("totalScore", parseInt(totalScore));
		}
		localStorage.setItem("numberOfCandiesPerRow", parseInt(resetNumber));
		console.log("reset to default:" + resetToDefault);
		window.location.reload(false);
	};

	const handleTouchNextLevel = () => {
		setNumberOfCandiesPerRow((prevCount) => prevCount + 1);
		numberOfElementsPerRow.current = numberOfElementsPerRow.current + 1;
		localStorage.setItem(
			"numberOfCandiesPerRow",
			parseInt(numberOfCandiesPerRow)
		);
		localStorage.setItem("totalMoves", parseInt(totalMoves));
		localStorage.setItem("totalScore", parseInt(totalScore));
		window.location.reload(false);
	};

	const handleTouchStartShowSteps = () => {
		// Score threshold to trigger point deduction
		const scoreThreshold = 50;
		findSoulutions(true);
		totalScore >= scoreThreshold
			? setTotalScore((prevScore) => prevScore - scoreThreshold)
			: setTotalScore(18);
		setTimeout(function () {
			findSoulutions(false);
		}, 1000);
	};

	useEffect(() => {
		localStorage.setItem("totalMoves", parseInt(totalMoves));
		localStorage.setItem("totalScore", parseInt(totalScore));
		localStorage.setItem(
			"numberOfCandiesPerRow",
			parseInt(numberOfCandiesPerRow)
		);
	}, [totalMoves]);

	useEffect(() => {
		toggleLocked();
		window.addEventListener("resize", function (event) {
			getScreenOrientation();
			return () => {
				window.removeEventListener("resize", function (event) {});
			};
		});
	}, []);

	useEffect(() => {
		console.log("gameArea" + gameArea);
		createBoard();
	}, [gameArea]);

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
		var isDirty = findSoulutions(false);
		if (keepSearching) {
			console.log("useEffect:" + keepSearching + "  - " + isDirty);
			if (!isDirty) setIsVisible(true);
		} else setIsVisible(false);
	}, [keepSearching]);

	function getScreenOrientation() {
		window.location.reload(false);
	}
	useLockBodyScroll();
	return (
		<div className="app">
			<div id="game" className="game">
				<div
					className="graycover"
					id={`${isVisible ? "" : "hideelement"}`}
				></div>
				<div
					className="dialog"
					id={`${isVisible ? "" : "hideelement"}`}
					onClick={() => handleTouchStartOver(false)}
					onTouchEnd={() => handleTouchStartOver(false)}
				>
					No more moves
					<br />
					Start over
				</div>
				<div
					className=" dialog nextlevel"
					id={`${isVisible ? "" : "hideelement"}`}
					onClick={() => handleTouchNextLevel()}
					onTouchEnd={() => handleTouchNextLevel()}
				>
					Take next level ({numberOfCandiesPerRow + 1})
				</div>
				{currentColorArrangement.map((candyColor, idx) => (
					<img
						src={candyColor}
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
						onTouchEnd={(e) => handleTouchEnd(e)}
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
					<div className="scoreboards">Efficiency:</div>

					<div className="scoreboardres">
						{parseInt((totalScore + 1) / (totalMoves + 1))}
					</div>
					<div className="spacer"></div>
				</div>
				<div className="scoreboard">
					<div className="spacer"></div>
					<div className="scoreboards">Available steps:</div>
					<button
						onClick={() => handleTouchStartShowSteps()}
						onTouchEnd={() => handleTouchStartShowSteps()}
					>
						Show
					</button>
					<div className="scoreboardres">{totalSolutions}</div>
					<div className="spacer"></div>
				</div>

				<div className="scoreboard">
					<div className="spacer"></div>
					<div className="scoreboards">Reset Game:</div>

					<div className="scoreboardres"></div>
					<button
						onClick={() => handleTouchStartOver(true)}
						onTouchEnd={() => handleTouchStartOver(true)}
					>
						Reset
					</button>
					<div className="spacer"></div>
				</div>

				<div>{txtTemp}</div>
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
					Developed by Laszlo Elo 2023 - Enjoy
				</div>
			</div>
		</div>
	);
}

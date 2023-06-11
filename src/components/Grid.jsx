/*eslint no-unused-vars: */
import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"
import { sudoku, encodeParams, bgColor, difficulties, getData, swapValuesInData } from "../helpers/helper"
import '../App.css'
import Spinner from "./Spinner"
import Swal from "sweetalert2"


export default function Grid() {
  const [solution, setSolution] = useState(Array.from(Array(9), () => Array(9).fill('')));
  const [grade, setGrade] = useState("easy");
  const [status, setStatus] = useState("not checked"); // solved or unsolvable
  const [loading, setLoading] = useState(true);
  const [restart, setRestart] = useState(false);
  const [data, setData] = useState(Array.from(Array(9), () => Array(9).fill('')));
  const [conflicts, setConflicts] = useState([]);
  const [hints, setHints] = useState(Array.from(Array(9), () => Array(9).fill(false)));


  const handleRestart = () => {
    setStatus("unsolved");
    setRestart(true);
    setHints(Array.from(Array(9), () => Array(9).fill(false)))
    setStatus("not checked");
  }

  const handleChange = (e, i, j) => {
    const newValue = Number(e.target.value.slice(0, 1));
    if (newValue === "") setConflicts([])
    const conflictIndices = findConflicts(data, i, j, newValue);
    if (newValue && conflictIndices.length > 0) {
      const newData = [...data];
      setData(newData);
      setConflicts(conflictIndices);
      return;
    }
    const newData = [...data];
    newData[i][j] = newValue;
    setData(newData);
    setConflicts([]);
  };


  const findConflicts = (data, row, col, value) => {
    const conflicts = [];
    // check if the value is already present in the same row
    for (let j = 0; j < 9; j++) {
      if (data[row][j] === value && j !== col) {
        conflicts.push([row, j]);
      }
    }
    // check if the value is already present in the same column
    for (let i = 0; i < 9; i++) {
      if (data[i][col] === value && i !== row) {
        conflicts.push([i, col]);
      }
    }
    // check if the value is already present in the same 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (data[i][j] === value && (i !== row || j !== col)) {
          conflicts.push([i, j]);
        }
      }
    }
    // return the indices of the conflicting cells
    return conflicts;
  };


  // replace every zero with a blank space

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiRequest(grade);
      const board = result.board.map((row) => row.map((val) => (val === 0 ? "" : val)));
      setData(board);
      setLoading(false);
    };

    if (restart) {
      setRestart(false);
      fetchData();
    }
  }, [grade, restart]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiRequest(grade);
      const board = result.board.map((row) => row.map((val) => (val === 0 ? "" : val)));
      setData(board);
      setLoading(false);
    };
    fetchData()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);



  const handleDifficultyChange = (event) => {
    setGrade(event.target.value);
  };


  function render(board, conflicts) {
    return board.map((row, i) =>
      row.map((item, j) => (
        <Cell
          key={`${i}${j}`}
          val={item === 0 ? "" : item}
          grayArea={sudoku[i][j] === 1 ? "odd" : ""}
          onChange={(e) => handleChange(e, i, j)}
          conflict={conflicts.some(([r, c]) => r === i && c === j) ? "conflict" : ""}
          hint={hints[i][j] === true ? "hint" : ""}
          restart={restart}
          mapKey={`${i}${j}`}
        />
      ))
    );
  }



  // getting for the latest data from grid board

  const getSolution = async () => {
    try {
      const board = await getData(data);
      const response = await fetch("https://sugoku.onrender.com/solve", {
        method: "POST",
        body: encodeParams({ board }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const hint = await response.json();
      setStatus(hint.status);
      setData(hint.solution);
      setSolution(hint.solution);
    } catch (error) {
      console.error(error);
    }
  };

  async function getHint() {
    try {
      const board = await getData(data);
      const response = await fetch("https://sugoku.onrender.com/solve", {
        method: "POST",
        body: encodeParams({ board: board }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const result = await response.json();
      const status = result.status;
      const resBoard = result.solution;
      if (status === "unsolvable") {
        let timerInterval
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'There is not any solution with this combination',
          timer:3500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then(() => {
          setHints(Array.from(Array(9), () => Array(9).fill(false)))
          setRestart(true);
        });
      } else {
        const newData = await swapValuesInData(resBoard, board);

        const newHints = newData.map((row, i) =>
          row.map(
            (item, j) =>
              item !== 0 &&
              resBoard[i][j] !== 0 &&
              resBoard[i][j] !== data[i][j]
          )
        );
        setHints(newHints);
        setData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  }


  const validateSolution = async () => {
    const board = await getData(data);
    const response = await fetch("https://sugoku.onrender.com/validate", {
      method: "POST",
      body: encodeParams({ board }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const result = await response.json();
    setStatus(result.status);
    return result.status;
  };

  return (
    <>
      <h1>Sudoku Solver React</h1>
      {loading ? <Spinner /> :
        <div className="grid">
          {render(data, conflicts)}
        </div>}
      <div className="buttons">
        <label htmlFor="difficulty-select">Difficulty:</label>
        <select id="difficulty-select" value={grade} onChange={handleDifficultyChange}>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        <button onClick={getSolution}>Get Solution</button>
        <button style={{ backgroundColor: bgColor(status) }} onClick={validateSolution}>Check status : {status}</button>
        <button>Level : {grade.slice(0, 1).toUpperCase() + grade.slice(1)}</button>
        <button onClick={getHint}>Get Hint</button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </>
  )
}
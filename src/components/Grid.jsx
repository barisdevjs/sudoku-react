/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"
import { sudoku, encodeParams, bgColor, difficulties, grid, getData, swapValuesInData, checkInput } from "../helpers/helper"
import '../App.css'


export default function Grid() {
  const [data, setData] = useState(Array.from(Array(9), () => Array(9).fill(undefined)));
  const [solution, setSolution] = useState(Array.from(Array(9), () => Array(9).fill('')));
  const [grade, setGrade] = useState("easy");
  const [status, setStatus] = useState("unsolved"); // solved or unsolvable
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restart, setRestart] = useState(false);


  const handleRestart = () => {
    setStatus("unsolved");
    setRestart(true);
  }

  useEffect(() => {
    grid.forEach((item) => {
      item.addEventListener("input", checkInput);
    })
    return () => {
      grid.forEach((item) => {
        item.removeEventListener("input", checkInput)
      });
    }
  }, [grid])

  useEffect(() => {
    setInputs(render(data))
  }, [data])

  const handleChange = (e, i, j) => {
    const newData = [...data];
    newData[i][j] = Number(e.target.value);
    setData(newData);
  }

  // replace every zero with a blank space

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiRequest(grade); // pass selected difficulty level to apiRequest function
      const board = result.board;
      board.forEach((item, index) => {
        item.forEach((item2, index2) => {
          if (item2 === 0) {
            board[index][index2] = "";
          }
        });
      });
      setData(board);
      setInputs(render(board));
      setLoading(false);
    };

    if (restart) {
      fetchData();
      setRestart(false);
    }
    else {
      fetchData();
    }
  }, [grade, restart]);

  const handleDifficultyChange = (event) => {
    setGrade(event.target.value);
  };


  function render(board) {
    return board.map((row, i) =>
      row.map((item, j) => (
        <Cell
          key={`${i}${j}`}
          val={item}
          grayArea={sudoku[i][j] === 1 ? 'odd' : ''}
          onChange={(e) => handleChange(e, i, j)}
        />
      ))
    );
  }

  // getting for the latest data from grid board


  const getSolution = async () => {
    const board = getData();
    const response = await fetch('https://sugoku.onrender.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await response.json();
    setStatus(data.status)
    setData(data.solution);
    setSolution(data.solution);
  };

  async function getHint() {
    const board = getData();
    const response = await fetch('https://sugoku.onrender.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await response.json();
    const resBoard = data.solution;
    const newData = await swapValuesInData(resBoard, board); // Swap arguments here
    setData(newData);
  }



  const validateSolution = async () => {
    const board = getData();
    const response = await fetch('https://sugoku.onrender.com/validate', {
      method: 'POST',
      body: encodeParams(board),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const data = await response.json()
    setStatus(data.status)
    return data.status
  }


  return (
    <>
      <h1>Sudoku Solver React</h1>
      <div className="grid">
        {inputs}
      </div>
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








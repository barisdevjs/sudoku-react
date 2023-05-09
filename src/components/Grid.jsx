

import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"
import { sudoku, encodeParams, bgColor, difficulties, getData, swapValuesInData } from "../helpers/helper"
import '../App.css'



export default function Grid() {
  const [solution, setSolution] = useState(Array.from(Array(9), () => Array(9).fill('')));
  const [grade, setGrade] = useState("easy");
  const [status, setStatus] = useState("unsolved"); // solved or unsolvable
  const [loading, setLoading] = useState(true);
  const [restart, setRestart] = useState(false);
  const [data, setData] = useState(Array.from(Array(9), () => Array(9).fill('')));


  const handleRestart = () => {
    setStatus("unsolved");
    setRestart(true);
  }

  const handleChange = (e, i, j) => {
    const newData = [...data];
    newData[i][j] = e.target.value !== "" ? Number(e.target.value) : null;
    setData(newData);
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
      fetchData();
      setRestart(false);
    } else {
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
          val={item === 0 ? "" : item}
          grayArea={sudoku[i][j] === 1 ? "odd" : ""}
          onChange={(e) => handleChange(e, i, j)}
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
      const data1 = await response.json();
      setStatus(data1.status);
      setData(data1.solution);
      setSolution(data1.solution);
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
      const data1 = await response.json();
      const resBoard = data1.solution;
      const newData = await swapValuesInData(resBoard, board);
      setData(newData);
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
    const data1 = await response.json();
    setStatus(data1.status);
    return data1.status;
  };

  return (
    <>
      <h1>Sudoku Solver React</h1>
      <div className="grid">
        {render(data)}
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








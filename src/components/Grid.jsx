/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"
import { checker, sudoku, encodeParams } from "../helpers/helper"
import '../App.css'


export default function Grid() {
  const [data, setData] = useState(Array.from(Array(9), () => Array(9).fill(undefined)));
  const [solution, setSolution] = useState(Array.from(Array(9), () => Array(9).fill('')));
  const [grade, setGrade] = useState('Random');
  const [flag, setFlag] = useState(false);
  const [status, setStatus] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(solution)
  console.log('data', data)


  const checkInput = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1)
    }
  }


  const grid = document.querySelectorAll(".grid input")
  // Driver function for the grid
  
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
  }, [])

  const handleChange = (e, i, j) => {
    const newData = [...data];
    newData[i][j] = Number(e.target.value);
    setData(newData);
  }

  // replace every zero with a blank space

  useEffect(() => {
    const fetchData = async () => {
      console.log('dsds')
      const result = await apiRequest()
      const board = result.board
      board.forEach((item, index) => {
        item.forEach((item2, index2) => {
          if (item2 === 0) {
            board[index][index2] = ""
          }
        })
      })
      setData(board)
      setInputs(render(board))
      setLoading(false);
    }
    fetchData()
  }, [])


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

  const getData = () => {
    const data = []
    grid.forEach((item, idx) => {
      // make 9 * 9 array
      if (idx % 9 === 0) {
        data.push([])
      }
      data[Math.floor(idx / 9)].push(Number(item.value))
    })
    return data
  }

  const board = getData();


  const getSolution = async () => {
    const response = await fetch('https://sugoku.onrender.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await response.json();
    // const flagTemp = await checker(board);
    setData(prev => prev = data.solution);
    setSolution(data.solution);
    // setFlag(flagTemp);
    const newInputs = render(data.solution); // render new inputs from solution
    setInputs(newInputs); // update inputs state with new inputs
  };



  // compare board and data and find the element that is not equal and give them a color of red

  // const compare = (data, board) => {
  //   const result = []
  //   data.forEach((row, i) => {
  //     row.forEach((item, j) => {
  //       if (item !== board?.[i]?.[j]) {
  //         result.push(item)
  //         board[i][j] = item
  //         item.classList?.add('red')
  //       }
  //     })
  //   })
  //   console.log(result)
  //   return result
  // }


  const validateSolution = async () => {
    const response = await fetch('https://sugoku.onrender.com/validate', {
      method: 'POST',
      body: encodeParams(getData()),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const data = await response.json()
    setStatus(data.status)
    return data.status
  }



  return (
    <>
      <div className="grid">
         {inputs} 
      </div>
      <div className="buttons">
        <button onClick={getSolution}>Get Solution</button>
        <button onClick={validateSolution}>Check Status {status}</button>
        <button onClick={getData}>Get Latest Data</button>
        <p>Level : {grade.slice(0, 1).toUpperCase() + grade.slice(1)}</p>
      </div>
    </>
  )
}








/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"
import {checker, sudoku , encodeParams} from "../helpers/helper"


export default function Grid() {
  const [data, setData] = useState([])
  const [grade, setGrade] = useState('Random')
  const [status, setStatus] = useState(null)
  const [solved, setSolved] = useState(false)
  const [flag ,setFlag] = useState(false)


  const checkInput = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1)
    }
  }


  // Driver function for the grid
  const grid = document.querySelectorAll(".grid input")

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


  // replace every zero with a blank space

  useEffect(() => {
    apiRequest().then((res) => {
      const board = res.board
      board.forEach((item, index) => {
        item.forEach((item2, index2) => {
          if (item2 === 0) {
            board[index][index2] = ""
          }
        })
      })
      setData(board)
    })

  }, [solved])


  const inputs = []
  data.forEach((row, i) => {
    row.forEach((item, j) => {
      inputs.push(
        <Cell key={`${i}${j}`}
          val={item}
          grayArea={sudoku[i][j] === 1 ? 'odd' : ''}
          onChange={(e) => {
            setData(
              data[i][j] = e.target.value
            )
          }
          }
        />
      )
    })
  })

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




  const getSolution = async () => {
    const board = getData()
    const response = await fetch('https://sugoku.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const data = await response.json()
    console.log(data.solution)
    const flagTemp = await checker(data.solution)
    setData(data.solution)
    setSolved(true)
    setFlag(flagTemp)
    return data.solution 
  }


  useEffect(() => {
    const getGrade = async () => {
      const board = getData()
      const response = await fetch('https://sugoku.herokuapp.com/grade', {
        method: 'POST',
        body: encodeParams({ board }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      const data = await response.json()
      setGrade(data.difficulty)
    }
    getGrade()
  }, [encodeParams, getData])

  const validateSolution = async () => {
    const response = await fetch('https://sugoku.herokuapp.com/validate', {
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
      <div className="grid" >
        {inputs}
      </div>
      <div className="buttons">
        <button onClick={getSolution}>Get Solution</button>
        <button onClick={validateSolution}>Check Status {status}</button>
        <p>Level : {grade.slice(0, 1).toUpperCase() + grade.slice(1)}</p>
      </div>
    </>
  )
}








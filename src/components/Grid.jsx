import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"
import Cell from "./Cell"


export default function Grid() {
  const [data, setData] = useState([])


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
  }, [data, grid])

  // styling for grid element

  let sudoku = [
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
  ]

  useEffect(() => {
    apiRequest().then((res) => {
      const board = res.board
      // replace every zero with a blank space
      board.forEach((item, index) => {
        item.forEach((item2, index2) => {
          if (item2 === 0) {
            board[index][index2] = ""
          }
        })
      })
      setData(board)
    })

  }, [])

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

  // write function for getting the data from the grid and console.logging it

  const sendData = () => {
    let data1 = {data}
    console.log(data1)
    return data1
  }

    /*************  For Solution   *******************/

    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

    const encodeParams = (params) =>
      Object.keys(params)
        .map(key => key + '=' + encodeBoard(params[key]))


    const getSolution = async () => {
      const response = await fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: encodeParams(sendData()),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      const data = await response.json()
      console.log(data.solution)
      return data
    }
    getSolution()

  return (
    <>
      <button onClick={sendData}>Send Data</button>
      <div className="grid" >
        {inputs}
      </div>
    </>
  )
}








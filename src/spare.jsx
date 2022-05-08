/* import React, { useEffect, useState } from "react"
import { apiRequest } from "../api/api"

export default function Grid() {
  const [data, setData] = useState([])
  // const ref = useRef()
  // for every input make sure only one number per an input field can be entered
  const checkInput = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1)
    }
  }

  // Driver function for the grid
  const grid = document.querySelectorAll(".grid input")

  useEffect(() => {
    grid.forEach((item) => {
      item.addEventListener("input", checkInput)
    })

    return () => {
      grid.forEach((item) => {
        item.removeEventListener("input", checkInput)
      })
    }
  }, [grid])

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
    }
    )
  }, [])

  console.log(data)
  let inputs = []
  
  console.log(inputs)
  
  data.forEach((row, i) => {
    row.forEach((item, j) => {
        inputs.push(
            <input
                key={`${i}${j}`}
                type="number"
                className={sudoku[i][j] === 1 ? "odd" : ""}
                min={1}
                max={9}
                value={item}
                onChange={(e) => {
                    data[i][j] = e.target.value
                    console.log(data[i][j] )
                }
                }
            />
        )
    })
})

return <div className="grid">{inputs}</div>
} */
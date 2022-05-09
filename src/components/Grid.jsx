import React, { useEffect, useState} from "react"
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
  }, [data,grid])
  
    console.log(data) 
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
          apiRequest()
        }, [])

  
  const inputs = []
        data.forEach((row, i) => {
          row.forEach((item, j) => {
            inputs.push(
              <Cell key={`${i}${j}`}
                val={item}
                grayArea={sudoku[i][j] === 1 ? 'odd' : ''}
                // if user adds a new value set the data 
              />
            )
          }
          )
        }
        )


        return (
          <div className="grid" >
            {inputs}
          </div>
        )
      }








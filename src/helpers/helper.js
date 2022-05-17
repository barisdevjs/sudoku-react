// check for a 2D array if there is a 0 in any of the rows or columns

export const checker = async (arr) => {
    const temp = await arr.flat(Infinity);
    const check = temp.some((item) => {
        return item === 0;
    });
    return check;
}

   // styling for grid element

   export let sudoku = [
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


  /*************  For Solution   *******************/

 export const encodeBoard = (board) => board.reduce((result, row, i) =>
    result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

  // eslint-disable-next-line react-hooks/exhaustive-deps
 export const encodeParams = (params) =>
    Object.keys(params)
      .map(key => key + `=  %5B${encodeBoard(params[key])}%5D`)
      .join('&');
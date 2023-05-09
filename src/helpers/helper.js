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

export function bgColor(status) {
  const statusMap = new Map(
    [
      ["unsolved", "gray"],
      ["unsolvable", "red"],
      ["solved", "green"]
    ]
  )
  return statusMap.get(status) || "#1890ff"
}

export const difficulties = ["easy", "medium", "hard"];


export const getData = async (grid) => {
  return new Promise((resolve, reject) => {
    const data = []
    grid.forEach((item, idx) => {
      // make 9 * 9 array
      if (idx % 9 === 0) {
        data.push([])
      }
      data[Math.floor(idx / 9)].push(Number(item.value))
    })
    resolve(data)
  })
}


export async function swapValuesInData(solution, data) {
  const newData = await structuredClone(data)
  const indices = [];
  while (indices.length < 3) {
    const i = Math.floor(Math.random() * solution.length);
    const j = Math.floor(Math.random() * solution[i].length);
    if (newData[i][j] !== solution[i][j] && newData[i][j] === 0) {
      indices.push([i, j]);
    }
  }
  for (let [i, j] of indices) {
    newData[i][j] = solution[i][j];
  }
  return newData
}

export const checkInput = (e) => {
  if (e.target.value.length > 1) {
    e.target.value = e.target.value.slice(0, 1)
  }
}
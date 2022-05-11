const EASY = 'easy'
const MEDIUM = 'medium'
const HARD = 'hard'
const RANDOM = 'random'

let difficulty = RANDOM

const BASEURL = `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`

export const apiRequest = async () => {
    const response = await fetch(BASEURL)
    const data = await response.json()
    return { board: data.board}
}


/*************  For Difficulty Level  *******************/

export const getDifficulty = async () => {
    const response = await fetch('https://sugoku.herokuapp.com/grade',{
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const data = await response.json()
    return data.difficulty
}

// getDifficulty().then(data => console.log(data))








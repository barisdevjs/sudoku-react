const EASY = 'easy'
const MEDIUM = 'medium'
const HARD = 'hard'
const RANDOM = 'random'

let difficulty = EASY

const BASEURL = `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`

export const apiRequest = async () => {
    const response = await fetch(BASEURL)
    const data = await response.json()
    return { board: data.board}
}









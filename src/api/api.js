const RANDOM = 'random'

const BASEURL = `https://sugoku.herokuapp.com/board?difficulty=${RANDOM}`


// Here is correctly setting up the API
export const apiRequest = async () => {
    const response = await fetch(BASEURL)
    const data = await response.json()
    return { board: data.board}
}

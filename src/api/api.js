const BASEURL = `https://sugoku.onrender.com/board`;

export const apiRequest = async (difficulty) => {
  const url = difficulty === "random" ? `${BASEURL}` : `${BASEURL}?difficulty=${difficulty}`;
  const response = await fetch(url);
  const data = await response.json();
  return { board: data.board};
};



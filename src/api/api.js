import Swal from 'sweetalert2'

const BASEURL = `https://sugoku.onrender.com/board`;

export const apiRequest = async (difficulty) => {
   
  const controller = new AbortController();
  const signal = controller.signal;
  
  const url = difficulty === "random" ? `${BASEURL}` : `${BASEURL}?difficulty=${difficulty}`;

  
  try {
    const response = await fetch(url, { signal });
    const data = await response.json();
    Swal.fire({
      title: 'Success',
      html: 'Data has been fetched successfully. <br>I will close in <b></b> milliseconds.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
    })
    return { board: data.board };
  } catch (error) {
    if (error.name === "AbortError") {
      Swal.fire({
        title: 'Error!',
        text: 'Request timed out, retrying...',
        icon: 'error',
        confirmButtonText: 'Retry'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Request Sent!',
            'Your file has been deleted.',
            'success'
          )
          return apiRequest(difficulty); // retry the request
        }
      })
    } else {
      throw error;
    }
  } finally {
    controller.abort()
  }
};

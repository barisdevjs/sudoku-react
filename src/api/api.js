import Swal from 'sweetalert2'

const BASEURL = `https://sugoku.onrender.com/board`;

export const apiRequest = async (difficulty) => {
   
  let timerInterval
  const controller = new AbortController();
  const signal = controller.signal;
  
  const url = difficulty === "random" ? `${BASEURL}` : `${BASEURL}?difficulty=${difficulty}`;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000); // abort after 5 seconds
  
  try {
    const response = await fetch(url, { signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    Swal.fire({
      title: 'Success',
      html: 'Data has been fetched successfully. <br>I will close in <b></b> milliseconds.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
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
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          return apiRequest(difficulty); // retry the request
        }
      })
    } else {
      throw error;
    }
  }
};

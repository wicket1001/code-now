import axios from 'axios'

let instance = null

export default function getAxios () {
  if (instance) {
    return instance
  }
  instance = axios.create({

  })
  /*
  axios.get(url)
    .then(res => {
      console.log(res)
      return res.json()
    })
    */
}

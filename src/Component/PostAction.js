
import axios from "axios";

export const PostAction = (method,data,url)=> {
    axios.defaults.baseURL = "/jeevdaya_donation/api";
    // let token = localStorage.getItem('token');
    // let Authorization = 'Bearer $'+{token};
  return new Promise((resolve) =>{
        axios({
            method,
            url,
            data,
            headers:{
                "Content-type": "application/json",
            },
        })
        .then((res) =>{
            console.log(res)
            resolve(res.data)
        })
        .catch((err) =>{
            resolve(err.response)
        })
  
    }
  )
}

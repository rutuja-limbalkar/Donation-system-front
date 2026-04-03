
import axios from "axios";

export const GetAction = (method,data,url)=> {
    axios.defaults.baseURL = "/jeevdaya_donation/api";
    
    return new Promise((resolve) =>{
        axios.get(url,{
            params:data
        })
        .then((res) =>{
            resolve(res.data)
        })
        .catch((err) =>{
            resolve(err.response)
        })
  
    }
  )
}

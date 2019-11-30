import axios from 'axios'

export const get = (url) =>{
    return axios({
        url
    }).then((result)=>{
        return result.data.data
    })
}


export const post = ({
    method='post',
    url,
    data
}) =>{
    console.log(data)
    return axios({
        method,
        url,
        data,
    }).then((result)=>{
        return result.data
    })
}

export const getOne = ({url,params}) =>{
    return axios({
        url,
        params
    }).then((result)=>{
        return result.data.data
    })
}
import axios from 'axios'
import qs from 'querystring'

var state = {
    message:'',
    detail:null,
    otherData:null,
    sequences:[]
}

var getters = {}

var mutations = {
    setDetail(state,detail){
        state.detail = detail
    },
    setOtherData(state,otherData){
        state.otherData = otherData
    },
    setSequences(state,sequences){
        state.sequences = sequences
    }
}

var actions = {
    setLogin : ({state,rootState},user) => {
        rootState.loading = true
        state.message = ''
        axios
            .post(process.env.VUE_APP_URL+'login',qs.stringify(user),{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                rootState.loading = false
                localStorage.setItem('userLoggedIn',JSON.stringify(res.data))
                location.reload()

            })
            .catch(err=>{
                rootState.loading = false
                if(err.response.status != 200){
                    state.message = err.response.data.message
                }
            })
    },
    setLogout : () => {
        localStorage.clear()
        location.reload()
    },
    userDetail:({rootState,commit})=>{
        axios
        .get(process.env.VUE_APP_URL+'auth-detail',{
            headers:{
                'Authorization':rootState.userLoggedIn.token
            }
        })
        .then(res=>{    
            commit('setDetail',res.data.data)
            commit('setOtherData',res.data.otherData)
            commit('setSequences',res.data.sequences)
        })
    }
}

export default{
    state,getters,mutations,actions
}
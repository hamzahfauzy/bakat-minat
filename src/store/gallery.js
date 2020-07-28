import axios from 'axios'

const state = {
    res:null,
    galleries:[],
}

const getters = {}

const mutations = {
    setGalleries(state,galleries){
        state.galleries = galleries
    }
}

const actions = {
    index({commit,rootState,state}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'media',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                rootState.loading = false
                commit('setGalleries',res.data.data)
                if(res.data.data.length === state.galleries.length){
                    rootState.loading = false
                }
            })
    }   ,
    new({rootState},gallery){
        axios
            .post(process.env.VUE_APP_URL+'media',gallery,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = {}
                },2000)
            })
    }  ,
    delete({rootState},id){
        axios
            .delete(process.env.VUE_APP_URL+'media/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = {}
                },2000)
            })
    }  ,
}

export default{
    state,getters,mutations,actions,namespaced : true
}
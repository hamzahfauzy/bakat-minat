import axios from 'axios'
import qs from 'querystring'

var state = {
    users: [],
    user:{},
    res:null,
    searches:[]
}

var getters = {}

var mutations = {
    setUsers(state,users){
        state.users = users
    },
    setUser(state,user){
        state.user = user
    },
    setSearches(state,users){
        state.searches = users
    }
}

var actions = {
    index({state,rootState,commit}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'users',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                commit('setUsers',res.data.data)
                if(res.data.data.length === state.users.length){
                    rootState.loading = false
                }
            })
    }   ,
    new({rootState},user){
        axios
            .post(process.env.VUE_APP_URL+'users',qs.stringify(user),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    view({state,rootState,commit},id){
        axios
            .get(process.env.VUE_APP_URL+'users/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.user = res.data.data
                commit('setUser',res.data.data)
            })
    }  ,
    update({rootState},user){
        axios
            .put(process.env.VUE_APP_URL+'users/'+user._id,qs.stringify(user),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    delete({rootState},id){
        axios
            .delete(process.env.VUE_APP_URL+'users/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
    } ,
    reset({rootState},id){
        axios
            .get(process.env.VUE_APP_URL+'users/'+id+'/reset',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
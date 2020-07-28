import axios from 'axios'
import qs from 'querystring'

var state = {
    sequences: [],
    sequence:{},
    res:null,
    searches:[]
}

var getters = {}

var mutations = {
    setSequences(state,sequences){
        state.sequences = sequences
    },
    setSequence(state,sequence){
        state.sequence = sequence
    },
    setSearches(state,sequences){
        state.searches = sequences
    }
}

var actions = {
    index({state,rootState,commit}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'sequences',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                commit('setSequences',res.data.data)
                if(res.data.data.length === state.sequences.length){
                    rootState.loading = false
                }
            })
    }   ,
    new({rootState},sequence){
        axios
            .post(process.env.VUE_APP_URL+'sequences',qs.stringify(sequence),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    view({state,rootState,commit},id){
        axios
            .get(process.env.VUE_APP_URL+'sequences/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.sequence = res.data.data
                commit('setSequence',res.data.data)
            })
    }  ,
    update({rootState},sequence){
        axios
            .put(process.env.VUE_APP_URL+'sequences/'+sequence._id,qs.stringify(sequence),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    delete({rootState},id){
        axios
            .delete(process.env.VUE_APP_URL+'sequences/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
import axios from 'axios'
import qs from 'querystring'

var state = {
    categories: [],
    category:null,
    parent:[],
    searches:[]
}

var getters = {}

var mutations = {
    setCategories(state,categories){
        state.categories = categories
    },
    setCategory(state,category){
        state.category = category
    },
    setSearches(state,categories){
        state.searches = categories
    },
}

var actions = {
    index({commit,rootState}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'categories',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                rootState.loading = false
                commit('setCategories',res.data.data)
                if(res.data.data.length === state.categories.length){
                    rootState.loading = false
                }
            })
    }   ,
    new({rootState},category){
        axios
            .post(process.env.VUE_APP_URL+'categories',qs.stringify(category),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = {}
                },2000)
            })
    }  ,
    view({commit,rootState},id){
        axios
            .get(process.env.VUE_APP_URL+'categories/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                commit('setCategory',res.data.data)
            })
    }  ,
    viewParent({state,rootState},id){
        axios
            .get(process.env.VUE_APP_URL+'categories/parent/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.parent = res.data.data
            })
    }  ,
    update({rootState},category){
        axios
            .put(process.env.VUE_APP_URL+'categories/'+category._id,category,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
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
            .delete(process.env.VUE_APP_URL+'categories/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                state.res = res
                setTimeout(()=>{
                    state.res = {}
                },2000)
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
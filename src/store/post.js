import axios from 'axios'
import qs from 'querystring'

var state = {
    posts:[],
    post:{},
    res:null,
    searches:[]
}

var getters = {}

var mutations = {
    setPosts(state,posts){
        state.posts = posts
    },
    setPost(state,post){
        state.post = post
    },
    setSearches(state,searches){
        state.searches = searches
    }
}

var actions = {
    get({commit,rootState}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'posts',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                let posts = res.data.data //.filter(post=>post.type_as != 'answer' && post.type_as != 'correct answer')
                commit('setPosts',posts)
                rootState.loading = false
            })
    }   ,
    new({rootState},post){
        axios
            .post(process.env.VUE_APP_URL+'posts',qs.stringify(post),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    view({commit,rootState},id){
        axios
            .get(process.env.VUE_APP_URL+'posts/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                commit('setPost',res.data.data)
            })
    }  ,
    import({rootState},data){
        axios
            .post(process.env.VUE_APP_URL+'posts/import/',data,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    type({state,rootState},type){
        axios
            .get(process.env.VUE_APP_URL+'posts/type/'+type,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    update({rootState},post){
        axios
            .put(process.env.VUE_APP_URL+'posts/'+post._id,qs.stringify(post),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    delete({rootState},id){
        axios
            .delete(process.env.VUE_APP_URL+'posts/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
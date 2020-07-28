import axios from 'axios'
import qs from 'querystring'

var state = {
    schools: [],
    school:{},
    res:null,
    searches:[],
    students:[],
}

var getters = {}

var mutations = {
    setSchools(state,schools){
        state.schools = schools
    },
    setSchool(state,school){
        state.school = school
    },
    setStudents(state,students){
        state.students = students
    },
    setSearches(state,schools){
        state.searches = schools
    }
}

var actions = {
    index({state,rootState,commit}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'schools',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                commit('setSchools',res.data.data)
                if(res.data.data.length === state.schools.length){
                    rootState.loading = false
                }
            })
    }   ,
    new({rootState},school){
        axios
            .post(process.env.VUE_APP_URL+'schools',qs.stringify(school),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    view({state,rootState,commit},id){
        axios
            .get(process.env.VUE_APP_URL+'schools/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                state.school = res.data.data
                commit('setSchool',res.data.data)
            })
    }  ,
    import({state,rootState,commit},param){
        axios
            .post(process.env.VUE_APP_URL+'schools/'+param.school_id,param.data,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            .then(res => {
                state.res = res.data
                commit('setStudents',res.data.data.students)
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    update({rootState},school){
        axios
            .put(process.env.VUE_APP_URL+'schools/'+school._id,qs.stringify(school),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
    }  ,
    delete({rootState},id){
        axios
            .delete(process.env.VUE_APP_URL+'schools/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
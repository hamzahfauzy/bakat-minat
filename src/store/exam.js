import axios from 'axios'
import qs from 'querystring'

var state = {
    exams:[],
    exam:{},
    res:null,
    hasil:{},
    participants:[],
    sequences:[],
    searches:[]
}

var getters = {}

var mutations = {
    setExams(state,exams){
        state.exams = exams
    },
    setParticipants(state,participants){
        state.participants = participants
    },
    setSequences(state,sequences){
        state.sequences = sequences
    },
    setExam(state,exam){
        state.exam = exam
    },
    setSearches(state,exams){
        state.searches = exams
    },
    setTanggal(state,hasil){
        state.hasil = hasil
    }
}

var actions = {
    index({rootState,commit}){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'exams',{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                commit('setExams',res.data.data)
                if(res.data.data.length === state.exams.length){
                    rootState.loading = false
                }
            })
    },
    getParticipants({rootState,commit}, exam_id){
        rootState.loading = true
        axios
            .get(process.env.VUE_APP_URL+'exams/'+exam_id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                commit('setParticipants',res.data.data.participants)
                rootState.loading = false
            })
    },
    import({state,rootState,commit},param){
        axios
            .post(process.env.VUE_APP_URL+'exams/'+param.exam_id,param.data,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'multipart/form-data'
                }
            })
            .then(res => {
                state.res = res.data
                commit('setParticipants',res.data.data.participants)
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    getTanggal({commit}){
        axios
            .get(process.env.VUE_APP_URL+'tanggal-pengumuman')
            .then(res => {
                commit('setTanggal',res.data.data)
            })
    }  ,
    new({state,rootState},exam){
        axios
            .post(process.env.VUE_APP_URL+'exams',qs.stringify(exam),{
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
    addSequence({state,rootState,commit},param){
        axios
            .post(process.env.VUE_APP_URL+'exams/'+param.exam_id+'/add-sequence',qs.stringify(param.sequence),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                commit('setSequences',res.data.data.sequences.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)))
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    doUpdateOrder({state,rootState,commit},param){
        axios
            .post(process.env.VUE_APP_URL+'exams/'+param.sequence_id+'/update-order',qs.stringify(param),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                commit('setSequences',res.data.data.sequences.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)))
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    doUpdateTimeout({state,rootState,commit},param){
        axios
            .post(process.env.VUE_APP_URL+'exams/'+param.sequence_id+'/update-countdown',qs.stringify(param),{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                state.res = res.data
                commit('setSequences',res.data.data.sequences)
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  ,
    view({rootState,commit},id){
        axios
            .get(process.env.VUE_APP_URL+'exams/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token,
                }
            })
            .then(res => {
                commit('setExam',res.data.data)
            })
    }  ,
    update({rootState},exam){
        axios
            .put(process.env.VUE_APP_URL+'exams/'+exam._id,qs.stringify(exam),{
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
    duplicate({rootState},exam){
        axios
            .post(process.env.VUE_APP_URL+'exams/'+exam._id+"/duplicate",qs.stringify(exam),{
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
            .delete(process.env.VUE_APP_URL+'exams/'+id,{
                headers: {
                    'Authorization':rootState.userLoggedIn.token
                }
            })
            .then(res => {
                const exam = state.exams.findIndex((us)=>{
                    return us._id === id
                })
                state.exams.splice(exam,1)
                state.res = res
                setTimeout(()=>{
                    state.res = null
                },2000)
            })
    }  
}

export default{
    state,getters,mutations,actions,namespaced:true
}
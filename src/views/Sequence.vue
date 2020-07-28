<template>
<div style="background:#eaeaea;" class="fill-height">
    <v-col class="text-center" style="position: fixed;z-index: 1;">
        <v-chip color="primary">{{data.countdown}} Detik</v-chip>
    </v-col>
    <v-container>
        <div style="padding-bottom: 50px"></div>
        <v-row justify="center" v-if="loading">
            <v-col sm="12" md="6" class="text-center">
                 <v-progress-circular
                    indeterminate
                    color="primary"
                ></v-progress-circular>
            </v-col>
        </v-row>
        <v-row justify="center" v-else>
            <v-col sm="12" md="6">
                <v-row dense>
                    <v-col cols="12" v-for="content in data.contents" :key="content._id">
                        <v-card outlined>
                            <v-card-text>
                                <p class="subtitle" v-html="content.parent.description"></p>
                                <v-radio-group @change="selectedAnswer" dense v-model="content.selected">
                                    <v-radio v-for="answer in content.childs" :key="answer._id" :value="answer._id">
                                        <template v-slot:label>
                                            <span v-html="answer.description" style="width:100%"></span>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col class="text-right">
                        <v-btn @click="next" depressed color="primary" block>
                            {{index == sequences.length-1 ? 'Selesai' : 'Selanjutnya'}} <v-icon>{{index == sequences.length-1 ? 'mdi-check' :'mdi-arrow-right'}}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import Swal from 'sweetalert2'
    export default {
        name:'Sequence',
        data(){
            return{
                answer:undefined,
                data:null,
                index:0,
                interval:null,
            }
        },
        created(){
            localStorage.getItem("seqActive") == 'finished' ? this.finish() : null
            this.index = localStorage.getItem("seqActive") ? localStorage.getItem("seqActive") : 0
            this.data = this.sequences[this.index]
            this.countdown()
        },
        computed:{
            ...mapState({
                sequences:state=>state.participant.sequences,
                loading:state=>state.loading
            }),
        },
        methods:{
            ...mapActions('participant',['sendUserSequence','finishExam']),
            selectedAnswer(){
                localStorage.setItem('sequences',JSON.stringify(this.sequences))
            },
            countdown(){
                this.interval = setInterval(()=>{                    
                    if(this.data.countdown < 1){
                        this.next()
                    }else{
                        this.data.countdown -= 1
                        localStorage.setItem('sequences',JSON.stringify(this.sequences))
                    }
                },1000)
            },
            async next(){
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if(this.index == this.sequences.length-1){
                    await this.finish()
                    localStorage.setItem("seqActive","finished")
                }else{
                    clearInterval(this.interval)
                    this.index++
                    await this.sendUserSequence({sequences:this.sequences,seqActive:this.index})
                    this.data = this.sequences[this.index]
                    localStorage.setItem("seqActive",this.index)
                    this.countdown()
                }
            },
            async finish(){ 
                var c = confirm("Apakah anda yakin telah menyelesaikan ujian?")
                if(c)
                {
                    await this.sendUserSequence({sequences:this.sequences,seqActive:this.index})
                    clearInterval(this.interval)
                    this.finishExam()
                }
                // return new Promise((resolve) => {
                //     Swal.fire({
                //         title:"Apakah anda yakin telah menyelesaikan ujian?",
                //         icon:'warning',
                //         showCancelButton: true,
                //         confirmButtonText: 'Yakin'
                //     }).then(async res => {
                //         if(res.value){
            //                 await this.sendUserSequence({sequences:this.sequences,seqActive:this.index})
            //                 clearInterval(this.interval)
            //                 this.finishExam()
            //                 resolve()
                //         }
                //     })
                // })
                
            },
        },
    }
</script>

<style>
    p img {
        max-width: 100% !important;
    }
</style>
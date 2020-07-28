<template>
    <v-container>
        <v-form ref="form" @submit.prevent="start" id="form-start">
            <v-row justify="center">
                <v-col cols="12" md="6">
                    <v-row dense>
                        
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <p class="title">Informasi Pribadi</p>
                        </v-col>
                        
                        <v-col v-for="(meta,idx) in person_information" :key="idx" cols="12">
                            <v-select v-if="meta.options" outlined dense :label="meta.label" :items="meta.options" v-model="meta.value"/>
                            <v-text-field v-else-if="meta.ttl" dense outlined v-model="meta.value" :loading="loading" :rules="rules" :label="meta.label" hint="Medan, 18 November 2002" persistent-hint />
                            <v-text-field v-else dense outlined v-model="meta.value" :loading="loading" :rules="rules" :label="meta.label" />
                        </v-col>

                        <v-col cols="12">
                            <p class="title">Informasi Akademik</p>
                        </v-col>
                        <v-col v-for="(meta,idx) in academyc_information" :key="idx" cols="12">
                            <div v-if="meta.items">
                                <p class="subtitle-1" v-text="meta.label" />
                                <div v-for="(item,ind) in meta.items" :key="ind" >
                                    <div v-if="item.items">
                                        <div class="d-flex justify-space-between">
                                            <p class="subtitle-2" v-text="item.label" />
                                            <v-btn icon x-small color="primary" @click="addItem(item)">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </div>
                                        
                                        <div v-for="(val,index) in item.value" :key="index">
                                            <div class="d-flex justify-space-between">
                                                <p class="body-1">{{item.label}} {{index+1}}</p>
                                                <v-btn icon x-small color="red" @click="item.value.splice(index,1)">
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </div>
                                            <v-text-field v-for="(it,indx) in val" :key="indx" dense outlined v-model="it.value" :loading="loading" :label="it.label" />
                                        </div>
                                    
                                    </div>
                                    <!-- <v-textarea v-else-if="item.label == 'Lainnya'" outlined :label="item.label" v-model="item.value"></v-textarea> -->
                                    <v-text-field v-else dense outlined v-model="item.value" :loading="loading" :label="item.label" />
                                </div>
                            </div>
                            <v-text-field v-else dense outlined v-model="meta.value" :loading="loading" :rules="rules" :label="meta.label" />
                        </v-col>

                        <v-col cols="12" class="text-center">
                            <v-btn depressed class="primary" type="submit" form="form-start" :loading="loading" block>Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    
    export default {
        name:'Start',
        data(){
            return{
                person_information:{
                    nama_lengkap:{
                        label:'Nama Lengkap',
                        value:'',
                    },
                    tempat_tanggal_lahir:{
                        label:'Tempat, Tanggal Lahir',
                        value:'',
                        ttl:true,
                    },
                    NISN:{
                        label:'NISN',
                        value:'' ,
                    },
                    jenis_kelamin:{
                        label:'Jenis Kelamin',
                        value:'',
                        options:['Laki-Laki','Perempuan']
                    },
                    nama_sma:{
                        label:'Nama SMA',
                        value:'',
                    },
                    asal_sekolah_smp:{
                        label:'Asal Sekolah SMP',
                        value:'',
                    },
                    jurusan:{
                        label:'Jurusan yang diinginkan',
                        value:'',
                        options:['IPA','IPS','BAHASA']
                    },
                    cita_cita:{
                        label:'Cita - cita',
                        value:'',
                    },
                },
                academyc_information: {
                    prestasi_akademik:{
                        label:'Prestasi Akademik',
                        items:{
                            rangking_tertinggi:{
                                label:'Rangking Tertinggi Selama SMP',
                                value:'',
                            },
                            // lainnya:{
                            //     label:'Lainnya',
                            //     value:'',
                            // }
                        },
                    },
                    prestasi_non_akademik:{
                        label:'Prestasi Non Akademik',
                        items:{
                            olimpiade: {
                                label:"Olimpiade",
                                value:[],
                                items:true
                            },
                            olahraga: {
                                label:"Olahraga",
                                value:[],
                                items:true
                            },
                            kesenian: {
                                label:"Kesenian",
                                value:[],
                                items:true
                            },
                        },
                    },
                },
                rules : [
                    v => !!v || 'This field is required'
                ],
            }
        },
        created(){
            this.userDetail()
            if(localStorage.getItem("sequences")){
                this.$router.push({name:'sequence'})
            }
        },
        computed:{
            ...mapState({
                loading : state => state.loading,
                user: state => state.userLoggedIn,
                detail : state => state.auth.detail,
                otherData : state => state.auth.otherData,
            })
        },
        methods:{
            ...mapActions('participant',['startExam']),
            ...mapActions(['userDetail']),
            ...mapMutations(['setDetail']),
            start(){
                const meta = {
                    exam_id:this.detail.metas.exam_id,
                    nama_lengkap:this.person_information.nama_lengkap.value,
                    tempat_tanggal_lahir:this.person_information.tempat_tanggal_lahir.value,
                    NISN:this.person_information.NISN.value,
                    jenis_kelamin:this.person_information.jenis_kelamin.value,
                    nama_sma:this.person_information.nama_sma.value,
                    asal_sekolah_smp:this.person_information.asal_sekolah_smp.value,
                    jurusan:this.person_information.jurusan.value,
                    cita_cita:this.person_information.cita_cita.value,
                    prestasi_akademik:{
                        rangking_tertinggi:this.academyc_information.prestasi_akademik.items.rangking_tertinggi.value,
                        // lainnya:this.academyc_information.prestasi_akademik.items.lainnya.value,
                    },
                    prestasi_non_akademik:{
                        olimpiade:this.academyc_information.prestasi_non_akademik.items.olimpiade.value,
                        olahraga:this.academyc_information.prestasi_non_akademik.items.olahraga.value,
                        kesenian:this.academyc_information.prestasi_non_akademik.items.kesenian.value
                    }
                }
                if(this.$refs.form.validate() && this.detail){
                    this.startExam(meta)
                }
            },
            addItem(item){
                const newItem = new Object({
                    nama:{
                        label:'Nama',
                        value:'',
                    },
                    tahun:{
                        label:'Tahun',
                        value:'',
                    },
                    hasil:{
                        label:'Hasil',
                        value:'',
                    },
                })
                item.value.push(newItem)
            }
        },
        watch:{
            detail(user){
                this.person_information.nama_lengkap.value = user.name
                this.person_information.NISN.value = user.username
                this.person_information.jenis_kelamin.value = user.metas.gender
                this.person_information.nama_sma.value = user.metas.nama_sma
            },
            otherData(data){
                this.person_information.nama_sma.value = data.school.name
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
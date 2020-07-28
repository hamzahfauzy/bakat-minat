<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">School</span>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'">
                <v-text-field outlined label="Search" v-model="search" @input="handleSearch" dense clearable class="d-inline"/>
            </v-col>
            <v-col class="text-right">
                <v-btn-toggle v-model="tableMode" class="mx-3">
                    <v-btn  @click="tableMode = 0" small>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                    <v-btn  @click="tableMode = 1" small>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-btn depressed color="primary" @click="addDialog = true">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row dense v-if="loading">
            <v-col cols="12" v-if="tableMode == 0">
                <v-skeleton-loader type="table"></v-skeleton-loader>
            </v-col>
            <v-col sm="12" md="3" v-for="i in 8" :key="i" v-else>
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row dense v-else>
            <v-col cols="12" v-if="tableMode == 0">
                <v-data-table
                    :headers="headers"
                    :items="schools"
                    :search="search"
                >
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="success" @click="student(item)" v-on="on">
                                    <v-icon small>mdi-account-group</v-icon>
                                </v-btn>
                            </template>
                            <span>Students</span>
                        </v-tooltip>
                        <v-btn icon @click="find(item._id)" color="orange" >
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="del(item._id)" color="red">
                            <v-icon small>mdi-delete </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>

            <v-col v-else v-for="school in searches.length ? searches : schools" :key="school._id" sm="12" md="3">
                <v-card outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text">{{school.converted_date}}</div>
                            <v-list-item-title class="headline mb-1">{{school.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="success" @click="student(school)" v-on="on">
                                    <v-icon small>mdi-account-group</v-icon>
                                </v-btn>
                            </template>
                            <span>Students</span>
                        </v-tooltip>
                        <v-btn text color="warning" @click="find(school._id)">
                            <v-icon left>mdi-pencil</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Edit' : ''}}
                        </v-btn>
                        <v-btn text color="red" @click="del(school._id)">
                            <v-icon left>mdi-delete</v-icon>
                            {{$vuetify.breakpoint.mdAndUp ? 'Delete' : ''}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add school Dialog -->
        <v-row dense>
            <v-dialog v-model="addDialog" max-width="600px">
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card>
                        <v-card-title>Add school</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="name" label="Name" :rules="rules" :loading="loading"/>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="addDialog = false">Close</v-btn>
                            <v-btn text color="primary" form="form-add" type="submit" :loading="loading">Tambah</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>

        <!-- Edit Dialog -->
        <v-row dense>
            <v-dialog v-model="editDialog" max-width="600px">
                <v-form ref="edit" @submit.prevent="edit" id="form-edit">
                    <v-card>
                        <v-card-title>Edit {{school.name}}</v-card-title>
                        <v-card-text>
                            <v-text-field dense outlined v-model="school.name" label="Name" :rules="rules" :loading="loading"/>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="editDialog = false">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-edit" :loading="loading">Edit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>

        <!-- Students dialog -->
        <v-row dense>
            <v-dialog v-model="studentDialog" max-width="950px" input>
                <v-card>
                    <v-card-title>
                        Student 
                        <v-btn depressed color="success" @click="openFileDialog" class="ml-auto">
                            <v-icon>mdi-plus</v-icon> Import
                        </v-btn>
                    </v-card-title>
                    <v-file-input style="display:none;" id="filetoupload" @change="uploadFile"></v-file-input>
                    <v-card-text>
                        <v-data-table :items-per-page="15" :headers="studentHeaders" :items="students" :loading="loading"/>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="warning" @click="studentDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState,mapMutations} from 'vuex'
    import Swal from 'sweetalert2'


    export default {
        name:'school',
        data(){
            return{
                addDialog:false,
                editDialog:false,
                rules: [
                    v => !!v || 'This field is required',
                ],
                name:'',
                search:'',
                headers: [
                    {text:'No',value:'index'},
                    {text: 'Name', value: 'name',},
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tableMode:0,
                studentDialog:false,
                school_active:{},
                studentHeaders:[
                    
                    {text:'NIS',value:'nis'},
                    {text:'Nama',value:'name'},
                    {text:'Tanggal Lahir',value:'birthdate'},
                    {text:'Jenis Kelamin',value:'gender'},
                ],
            }
        },
        created(){
            this.index()
        },
        computed:{
            ...mapState({
                schools:state=>state.school.schools.map((items,index)=>({...items,index:index+1})),
                school:state=>state.school.school,
                students:state=>state.school.students,
                loading:state=>state.loading,
                searches:state=>state.school.searches,
            })
        },
        methods:{
            ...mapActions('school',['index','new','view','update','delete','import']),
            ...mapMutations('school',['setSchool','setSchools','setStudents','setSearches']),
            openFileDialog(){
                var filetoupload = document.getElementById('filetoupload')
                filetoupload.click()
            },
            uploadFile(){
                var files = document.getElementById('filetoupload').files
                var formData = new FormData
                formData.append('filetoupload',files[0])
                formData.append('school_id',this.school_active._id)
                this.import({school_id:this.school_active._id,data:formData})
                this.index()
            },
            student(school){
                this.school_active = school
                this.studentDialog = true
                this.setStudents(school.students)
            },
            add(){
                if(this.$refs.form.validate()){
                    this.new({name:this.name})
                    this.addDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been added',
                        'success'
                    ).then((res)=>{
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            find(id){
                this.view(id)
                this.editDialog = true
            },
            edit(){
                if(this.$refs.edit.validate()){
                    this.update(this.school)
                    this.editDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been updated',
                        'success'
                    ).then(res=>{
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            del(id){    
               Swal.fire({
                    title:"Are you Sure to delete it?",
                    icon:'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!'
                }).then(res => {
                    if(res.value){
                        this.delete(id)
                        Swal.fire(
                            'Deleted!',
                            'The item has been deleted',
                            'success'
                        ).then(res=>{
                            if(res.value){
                                this.index()
                            }
                        })
                    }
                })
            },
            formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear(),
                    hours = d.getHours(),
                    minutes = d.getMinutes(),
                    seconds = d.getSeconds();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                var _time = [hours, minutes, seconds].join(':')
                var _date = [day, month, year].join('-');

                return [_date,_time].join(' ')
            },
            handleSearch(){
                let searched = this.schools.filter(school=>school.name.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            }
        },
        watch:{
            schools: function() {
                this.schools.forEach(val => {
                    val['converted_date'] = this.formatDate(val.create_date)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
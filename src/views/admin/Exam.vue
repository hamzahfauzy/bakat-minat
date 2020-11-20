<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <span class="title">Exam</span>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'">
                <v-text-field outlined label="Search" v-model="search" @input="handleSearch" dense clearable class="d-inline"/>
            </v-col>
            <v-col class="text-right">
                <v-btn-toggle v-model="tableMode" class="mx-2">
                    <v-btn  @click="tableMode = 0" small>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                    <v-btn  @click="tableMode = 1" small>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-btn depressed color="primary" @click="dialog = true">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row dense v-if="loading">
            <v-col cols="12" v-if="tableMode == 0">
                <v-skeleton-loader type="table"></v-skeleton-loader>
            </v-col>
            <v-col cols="12" md="3" v-for="i in 8" :key="i" v-else>
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row dense v-else>
            <v-col cols="12" v-if="tableMode == 0">
                <v-data-table
                    :headers="headers"
                    :items="exams"
                    :search="search"
                >
                    <template v-slot:item.answers="{item}">
                        <v-chip-group v-if="item.type_as == 'question'">
                            <v-chip v-for="answer in item.answers" :key="answer._id" :class="answer.type_as == 'correct answer' ? 'success' : ''" disable small>
                                <span v-html="answer.description.replace(/<\/?[^>]+(>|$)/g, '')"></span>
                                <v-btn icon x-small :to="`${answer._id}`" append class="ml-4">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon x-small @click="del(answer._id)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-chip>
                            <v-chip color="primary" :to="`answer/${item._id}`" append small>
                                <v-icon>mdi-plus</v-icon>
                            </v-chip>
                        </v-chip-group>
                        <span v-else>This isn't a question</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="success" @click="participant(item)" v-on="on">
                                    <v-icon small>mdi-account-group</v-icon>
                                </v-btn>
                            </template>
                            <span>Participant</span>
                        </v-tooltip>
                        <!-- <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" @click="sequence(item)"  v-on="on">
                                    <v-icon small>mdi-fast-forward</v-icon>
                                </v-btn>
                            </template>
                            <span>Sequence</span>
                        </v-tooltip> -->
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="warning" @click="find(item._id)"  v-on="on">
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="red" @click="del(item._id)"  v-on="on">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="purple" @click="find(item._id,true)"  v-on="on">
                                    <v-icon small>mdi-clipboard-multiple-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Duplicate</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="purple" @click="doResetParticipant(item._id)"  v-on="on">
                                    <v-icon small>mdi-refresh</v-icon>
                                </v-btn>
                            </template>
                            <span>Reset Participant</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="green" v-on="on" @click="openUploadDialog(item._id)">
                                    <v-icon small>mdi-upload</v-icon>
                                </v-btn>
                                <v-file-input style="display:none;" id="inputUpload" @change="uploadNilai"></v-file-input>
                            </template>
                            <span>Upload Nilai</span>
                        </v-tooltip>
                        <v-menu offset-y open-on-hover>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="info" v-on="on">
                                    <v-icon small>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="report(item._id)" >
                                    <v-list-item-title>Download Nilai</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="reportDetail(item._id)" >
                                    <v-list-item-title>Download Detail Nilai</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="beritaacara(item._id)" >
                                    <v-list-item-title>Berita Acara</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
            </v-col>

            <v-col v-else cols="12" md="3"  v-for="(exam,index) in searches.length ? searches : exams" :key="index">
                <v-card outlined>
                    <v-list-item three-line dense>
                        <v-list-item-content>
                            <div class="overline mb-4 primary--text">{{exam.converted_date}}</div>
                            <v-list-item-title class="headline mb-1">{{exam.title}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="success" @click="participant(exam)" v-on="on">
                                    <v-icon >mdi-account-group</v-icon>
                                </v-btn>
                            </template>
                            <span>Participant</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" @click="sequence(exam)"  v-on="on">
                                    <v-icon >mdi-fast-forward</v-icon>
                                </v-btn>
                            </template>
                            <span>Sequence</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="warning" @click="find(exam._id)"  v-on="on">
                                    <v-icon >mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="red" @click="del(exam._id)"  v-on="on">
                            <v-icon >mdi-delete</v-icon>
                        </v-btn>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="purple" @click="find(exam._id,true)"  v-on="on">
                                    <v-icon >mdi-clipboard-multiple-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Duplicate</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="info" @click="download"  v-on="on">
                                    <v-icon>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Report</span>
                        </v-tooltip>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- Dialog -->
        <v-row dense>
            <v-dialog v-model="dialog" max-width="600px">
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card>
                        <v-card-title>Add Exam</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined v-model="title" :rules="rules" label="Title"/>
                            <v-text-field dense outlined v-model="start_time" :rules="rules" label="Start Time" type="datetime-local"/>
                            <v-text-field dense outlined v-model="end_time" :rules="rules" label="End Time" type="datetime-local"/>
                            <v-select :items="schools" item-text="name" v-model="school" dense outlined label="School" item-value="_id" :rules="rules"></v-select>
                            <v-select style="display: none" :items="sequences" item-text="title" v-model="seqs" dense outlined label="Sequences" item-value="_id" multiple :rules="rules" deletable-chips small-chips></v-select>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="dialog = false">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-add" :loading="loading">Tambah</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
        <!-- Edit Dialog -->
        <v-row dense v-if="exam">
            <v-dialog v-model="editDialog" max-width="600px">
                <v-form ref="edit" @submit.prevent="edit" id="form-edit">
                    <v-card>
                        <v-card-title>Edit {{exam.title}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined v-model="exam.title" :rules="rules" label="Title"/>
                            <v-text-field dense outlined v-model="exam.start_time" :rules="rules" label="Start Time" type="datetime-local"/>
                            <v-text-field dense outlined v-model="exam.end_time" :rules="rules" label="End Time" type="datetime-local"/>
                            <v-select :items="schools" item-text="name" v-model="exam.school_id" dense outlined label="School" item-value="_id"></v-select>
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
        <!-- Duplicate Dialog -->
        <v-row dense v-if="exam">
            <v-dialog v-model="duplicateDialog" max-width="600px">
                <v-form ref="duplicate" @submit.prevent="dupli" id="form-duplicate">
                    <v-card>
                        <v-card-title>Duplicate {{exam.title}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined v-model="exam.title" :rules="rules" label="Title"/>
                            <v-text-field dense outlined v-model="exam.start_time" :rules="rules" label="Start Time" type="datetime-local"/>
                            <v-text-field dense outlined v-model="exam.end_time" :rules="rules" label="End Time" type="datetime-local"/>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="duplicateDialog = false">Close</v-btn>
                            <v-btn text color="primary" type="submit" form="form-duplicate" :loading="loading">Duplicate</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>

        <v-row dense>
            <v-dialog v-model="participantDialog" max-width="950px" input>
                <v-card>
                    <v-card-title>
                        Participant 
                        <v-btn depressed color="success" @click="openFileDialog" class="ml-auto">
                            <v-icon>mdi-plus</v-icon> Import
                        </v-btn>
                    </v-card-title>
                    <v-file-input style="display:none;" id="filetoupload" @change="uploadFile"></v-file-input>
                    <v-card-text>
                        <v-data-table :items-per-page="100" :headers="participantHeaders" :items="participants" :loading="loading">
                            <template v-slot:item.hasil="{item:{nilai},header}">
                                <span v-for="n in nilai" :key="n.title">
                                    <span v-if="n.title == header.text">{{n.hasil}}</span>
                                </span>
                            </template>
                            <template v-slot:item.status="{item}">
                                <span v-text="item.metas.end_time !== undefined ? 'Selesai' : item.metas.start_time == undefined ? '' : 'Sedang Mengerjakan'" :class="item.metas.exam_finished ? 'success--text' : 'warning--text'"></span>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="warning" @click="participantDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>

        <v-row dense>
            <v-dialog v-model="sequenceDialog" max-width="950px">
                <v-card>
                    <v-card-title>
                        Sequence 
                        <v-btn depressed color="success" class="ml-auto" @click="addSequenceDialog = true">
                            <v-icon>mdi-plus</v-icon> Add Sequence
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :items-per-page="15" :headers="sequenceHeaders" :loading="loading" :items="sequences">
                            <template v-slot:item.countdown="props">
                                <v-row dense>
                                    <v-col sm="12" md="3">
                                        <v-text-field dense outlined label="Timeout" :append-icon="'mdi-border-color'" v-model="props.item.countdown" @click:append="updateTimeout(props)"  style="margin-top: 20px"/>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-slot:item.controls="props">
                                <v-row dense>
                                    <v-col sm="12" md="3">
                                        <v-text-field dense outlined label="Order" :append-icon="'mdi-border-color'" v-model="props.item.order" @click:append="updateOrder(props)"  style="margin-top: 20px"/>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="warning" @click="sequenceDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>

        <v-row dense>
            <v-dialog v-model="addSequenceDialog" max-width="950px">
                <v-card>
                    <v-card-title>
                        Add Sequence 
                    </v-card-title>
                    <v-card-text>
                        <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                        <v-text-field dense outlined v-model="sequence_field.title" label="Title"/>
                        <v-select dense outlined v-model="sequence_field.content_type" label="Content Type" @change="loadContent" :items="content_type"></v-select>
                        <v-select dense outlined  v-model="sequence_field.content" label="Content" :items="contents"></v-select>
                        <v-text-field dense outlined v-model="sequence_field.order" label="Order"/>
                        <v-text-field dense outlined  v-model="sequence_field.timeout" label="Timeout"/>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="warning" @click="addSequenceDialog = false">Close</v-btn>
                        <v-btn text color="primary" @click="saveSequence">Simpan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
    import { mapActions, mapState, mapMutations } from 'vuex'
    import Swal from 'sweetalert2'

    export default {
        name:'Exam',
        data(){
            return{
                columns : [
                    {
                        label: "Product",
                        field: "product",
                    },
                    {
                        label: "Price",
                        field: "price",
                        dataFormat: this.priceFormat
                    },
                    {
                        label: "Quantity",
                        field: "quantity",
                    },
                ],
                data : [
                    {
                        product: "Beverage",
                        price: 10,
                        quantity: 2
                    },
                    {
                        product: "Snack",
                        price: 12,
                        quantity: 6
                    },
                    {
                        product: "Beverage",
                        price: 10,
                        quantity: 5
                    },
                    {
                        product: "Snack",
                        price: 12,
                        quantity: 3
                    }
                ],
                dialog:false,
                participantHeaders:[
                    // {text:'NIS',value:'metas.NISN'},
                    {text:'Nama',value:'name'},
                    // {text:'Tanggal Lahir',value:'metas.tempat_tanggal_lahir'},
                    // {text:'Jenis Kelamin',value:'metas.jenis_kelamin'},
                    {text:'Status',value:'status'},
                    {text:'R',value:'R'},
                    {text:'I',value:'I'},
                    {text:'A',value:'A'},
                    {text:'S',value:'S'},
                    {text:'E',value:'E'},
                    {text:'C',value:'C'}
                ],
                sequenceHeaders:[
                    {text:'Title',value:'title'},
                    {text:'Timeout',value:'countdown'},
                    {text:'Order',value:'controls'},
                ],
                sequence_field:{
                    title:'',
                    content_type:'',
                    content:'',
                    order:0,
                    timeout:20,
                },
                exam_active:{},
                exam_clicked:0,
                title:'',
                start_time:'',
                end_time:'',
                school:'',
                seqs:[],
                rules:[
                    v => !!v || 'This Field is Required'
                ],
                content_type:[
                    'post','question','category'
                ],
                tab:null,
                contents:[],
                duplicateDialog:false,
                editDialog:false,
                participantDialog:false,
                sequenceDialog:false,
                addSequenceDialog:false,
                search:'',
                headers: [
                    {text: 'No', value: 'index'},
                    {text: 'Title', value: 'title'},
                    {text: 'Start Time', value: 'converted_start_time'},
                    {text: 'End Time', value: 'converted_end_time'},
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                tableMode:0
            }
        },
        created(){
            this.index()
            this.get()
            this.getCategories()
            this.getSchools()
            this.getSequences()
        },
        computed:{
            ...mapState({
                exams : state => state.exam.exams.map((items,index)=>({...items,index:index+1})),
                exam : state => state.exam.exam,
                categories : state => state.category.categories,
                posts : state => state.post.posts,
                loading: state=> state.loading,
                res:state=>state.exam.res,
                participants:state=>state.exam.participants,
                sequences:state=>state.sequence.sequences,
                searches:state=>state.exam.searches,
                schools:state=>state.school.schools,
            })
        },
        methods:{
            ...mapActions('exam',['index','new','import','importNilai','view','update','delete','addSequence','doUpdateOrder','doUpdateTimeout','duplicate','resetParticipants','getParticipants','getParticipantsActive']),
            ...mapActions('category',{
                getCategories:'index'
            }),
            ...mapActions('sequence',{
                getSequences:'index'
            }),
            ...mapActions('post',['get']),
            ...mapActions('school',{
                getSchools:'index'
            }),
            ...mapMutations('exam',['setParticipants','setSequences','setSearches','setParticipantsActive']),
            async report(exam_id){
                // let res = await fetch(process.env.VUE_APP_URL+'exams/report/'+exam_id)
                // let data = await res.json()
                // console.log(data)
                // window.open(process.env.VUE_APP_URL+data.file)
                window.open(process.env.VUE_APP_URL+'exams/report/'+exam_id)
            },
            async reportDetail(exam_id){
                // let res = await fetch(process.env.VUE_APP_URL+'exams/report/'+exam_id)
                // let data = await res.json()
                // console.log(data)
                // window.open(process.env.VUE_APP_URL+data.file)
                window.open(process.env.VUE_APP_URL+'exams/report-detail/'+exam_id)
            },
            async beritaacara(exam_id){
                // let res = await fetch(process.env.VUE_APP_URL+'exams/berita-acara/'+exam_id)
                // let data = await res.json()
                // console.log(data)
                // window.open(process.env.VUE_APP_URL+data.file)
                window.open(process.env.VUE_APP_URL+'exams/berita-acara/'+exam_id)
            },
            openFileDialog(){
                var filetoupload = document.getElementById('filetoupload')
                filetoupload.click()
            },
            openUploadDialog(exam_id){
                this.exam_clicked = exam_id
                var filetoupload = document.getElementById('inputUpload')
                filetoupload.click()
            },
            uploadFile(){
                var files = document.getElementById('filetoupload').files
                var formData = new FormData
                formData.append('filetoupload',files[0])
                formData.append('exam_id',this.exam_active._id)
                this.import({exam_id:this.exam_active._id,data:formData})
                this.index()
            },
            uploadNilai(){
                var files = document.getElementById('inputUpload').files
                var formData = new FormData
                formData.append('inputUpload',files[0])
                formData.append('exam_id',this.exam_clicked)
                this.importNilai({exam_id:this.exam_clicked,data:formData})
                this.index()
            },
            loadContent(){
                if(this.sequence_field.content_type == 'category'){
                    this.contents = this.categories.map(val => {
                        return {text:val.name,value:val._id}
                    })
                }
                else
                {
                    var ctype = this.sequence_field.content_type 
                    var posts = this.posts.filter(val => val.type_as === ctype)
                    this.contents = posts.map(val => {
                        return {text:val.title,value:val._id}
                    })
                }
            },
            saveSequence(){
                this.addSequence({exam_id:this.exam_active._id,sequence:this.sequence_field})
                this.index()
            },
            add(){
                if(this.$refs.form.validate()){
                    this.new({title:this.title,start_time:this.start_time,end_time:this.end_time,school_id:this.school,sequences:this.seqs})
                    this.dialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been created',
                        'success'
                    ).then(res => {
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            participant(exam){
                // this.getParticipantsActive(exam.school_id)
                this.setParticipants([])
                this.exam_active = exam
                this.participantDialog = true
                this.getParticipants(exam._id)
            },
            doResetParticipant(exam_id){
                Swal.fire({
                    title:"Are you Sure to reset it?",
                    icon:'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Reset it!'
                }).then(res => {
                    if(res.value){
                        this.resetParticipants(exam_id)
                        Swal.fire(
                            'Reseted!',
                            'The participants has been reset',
                            'success'
                        ).then(res=>{
                            if(res.value){
                                this.index()
                            }
                        })
                    }
                })
            },
            sequence(exam){
                this.exam_active = exam
                this.sequenceDialog = true
                this.setSequences(exam.sequences.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)))
            },
            updateOrder(props){
                this.doUpdateOrder({sequence_id:props.item._id,order:props.item.order})
                this.index()
            },
            updateTimeout(props){
                this.doUpdateTimeout({sequence_id:props.item._id,countdown:props.item.countdown})
                this.index()
            },
            find(id,duplicate = false){
                this.view(id)
                if(duplicate){
                    this.duplicateDialog = true
                }else{
                    this.editDialog = true
                }
            },  
            edit(){
                if(this.$refs.edit.validate()){
                    this.update(this.exam)
                    this.editDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been updated',
                        'success'
                    ).then(res => {
                        if(res.value){
                            this.index()
                        }
                    })
                }
            },
            dupli(){
                if(this.$refs.duplicate.validate()){
                    this.duplicate(this.exam)
                    this.duplicateDialog = false
                    Swal.fire(
                        'Success!',
                        'The item has been Duplicated',
                        'success'
                    ).then(res => {
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
                let searched = this.exams.filter(exam=>exam.title.toLowerCase().includes(this.search.toLowerCase()))
                this.setSearches(searched)
            },
            download(){
                console.log('donwloaded')
            }
        },
        watch:{
            exams: function() {
                this.exams.forEach(val => {
                    val['converted_start_time'] = val.start_time ? this.formatDate(val.start_time) : '-'
                    val['converted_end_time'] = val.end_time ? this.formatDate(val.end_time) : '-'
                    val['converted_date'] = this.formatDate(val.create_date)
                })
            },
            // participantsActive: function(){
            //     this.participantsActive.forEach(val => {
            //         var nilai = ""
            //         val.nilai.forEach(v => {
            //             nilai = v.nilai
            //         })
            //         val.hasil = nilai
            //     }),
            //     this.sequences.forEach(sequence=>{
            //         this.participantActiveHeaders.push({text:sequence.title,value:'hasil'})
            //     })
            // }
        },
    }
</script>

<style lang="scss" scoped>

</style>
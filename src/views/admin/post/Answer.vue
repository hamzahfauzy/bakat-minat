<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-form ref="edit" @submit.prevent="edit" id="form-edit">
                    <v-card outlined>
                        <v-card-title>Add Answer for {{post.title}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-select dense outlined label="Type as" v-model="answer.type_as" :items="type_asR"></v-select>
                            <ckeditor v-model="answer.description" class="mb-5" :config="editorConfig" ref="cke" />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" to="/admin/post" exact>Back</v-btn>
                            <v-btn text color="primary" type="submit" form="form-edit" :loading="loading">Add</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState} from 'vuex'

    export default {
        name:'PostAnswer',
        data(){
            return{
                rules:[
                    v => !!v || 'This Field is Required'
                ],
                answer:{
                    title:'Jawaban',
                    type_as:'',
                    description:'',
                },
                type_asR: ['correct answer','answer'],
                editorConfig:{},
            }
        },
        created(){
            this.editorConfig = {
                extraPlugins: ['uploadimage','justify'],
                filebrowserUploadUrl: process.env.VUE_APP_UPLOAD_URL,
                filebrowserUploadMethod:"form"
            }
            this.view(this.$route.params.id)
        },
        computed:{
            ...mapState({
                post:state=>state.post.post,
                loading:state=>state.loading,
                res:state=>state.post.res,
            }),
        },
        methods:{
            ...mapActions('post',['new','view']),
            edit(){
                if(this.$refs.edit.validate()){
                    this.answer.parent = this.post._id
                    this.answer.description = this.$refs.cke.instance.getData()
                    this.new(this.answer)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
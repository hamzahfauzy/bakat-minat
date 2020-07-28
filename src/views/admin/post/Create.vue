<template>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-form ref="form" @submit.prevent="add" id="form-add">
                    <v-card outlined>
                        <v-card-title>Add {{isInstruction ? 'Instruksi' : 'Post'}}</v-card-title>
                        <v-card-text>
                            <v-alert type="success" v-if="res">{{res.message}}</v-alert>
                            <v-text-field dense outlined label="Title" v-model="title" :rules="rules"/>
                            <v-select v-model="type_as" dense label="Type As" outlined :items="type_asR" v-if="!isInstruction"></v-select>
                            <ckeditor v-model="description" class="mb-5" :config="editorConfig" ref="cke"></ckeditor>
                            <v-select v-model="category" dense label="Category" outlined :items="categories" item-text="name" item-value="_id"></v-select>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" :to="`/admin/post${isInstruction ? '?instruction=true' : ''}`" exact>Back</v-btn>
                            <v-btn text color="primary" type="submit" form="form-add" :loading="loading">Tambah</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapState,mapActions} from 'vuex'

    export default {
        name:'PostCreate',
        data(){
            return{
                rules:[
                    v => !!v || 'This Field is Required'
                ],
                title:'',
                type_as:'',
                type_asR:['question','post'],
                description:'',
                category:{},
                editorConfig:{},
            }
        },
        created(){
            this.editorConfig = {
                extraPlugins: ['uploadimage','justify'],
                filebrowserUploadUrl: process.env.VUE_APP_UPLOAD_URL,
                filebrowserUploadMethod:"form"
            }
            this.index()
        },
        computed:{
            ...mapState({
                loading:state=>state.loading,
                res:state=>state.post.res,
                categories:state=>state.category.categories,
            }),
            isInstruction(){
                if(this.$route.query.instruction){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            ...mapActions('post',['new']),
            ...mapActions('category',['index']),
            add(){
                if(this.$refs.form.validate()){
                    this.description = this.$refs.cke.instance.getData()
                    this.new({
                        title:this.title,
                        description:this.description,
                        type_as:this.isInstruction ? 'post' : this.type_as,
                        category:this.category
                    })
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
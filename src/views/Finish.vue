<template>
    <v-container fluid class="fill-height">
        <v-row dense align="center" justify="center">
            <v-col class="text-center">
                <v-img src="../assets/logo.png" alt="Logo Z-Techno" eager height="150" contain></v-img>
                <p class="display-1 my-5">Terima Kasih sudah mengikuti ujian!</p>
                <v-btn depressed color="primary" @click="back">Kembali</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name:'Finish',
        methods:{
            back(){
                this.$router.push({name:'dashboard'})
                location.reload()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
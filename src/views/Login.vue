<template>
    <v-container fluid class="fill-height">
        <v-row dense align="center" justify="center">
            <v-col sm="12" md="5" class="text-center">
                <v-card outlined class="pa-5">
                    <v-card-text>
                        <v-img src="../assets/logo.png" alt="Logo Z-Techno" eager height="150" contain></v-img>
                        <h2 class="heading my-5">Login</h2>
                        <v-alert v-if="auth.message" type="error" dense>{{auth.message}}</v-alert>
                        <v-alert v-if="!browserCheck" type="warning" dense>
                        Agar lancar dalam melaksanakan tes minat bakat, pastikan anda menggunakan browser Google Chrome dengan versi terbaru.<br>
                        Klik <a href="https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.android.chrome">Disini</a> untuk mengupdate google chrome.
                        </v-alert>
                        <v-form ref="form" @submit.prevent="login" id="form-login">
                            <v-text-field dense outlined v-model="username" :loading="loading" :rules="rules" label="Username" />
                            <v-text-field dense outlined v-model="password" :loading="loading" :rules="rules" label="Password" type="password" />
                            <v-btn depressed class="primary" type="submit" form="form-login" :loading="loading" block>Login</v-btn>
                            <div>
                                <br>
                                <b>Kontak Whatsapp:</b><br>
                                087867504803 (Bapak Ferdy)<br>
                                082367579262 (Ibu Yani)<br>
                                082166601184 (Ibu Thalita)<br>
                            </div>
                            <v-btn text disabled block>copyright &copy; 2020 z-techno</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapActions,mapState,mapMutations} from 'vuex'

    export default {
        name:'Login',
        data(){
            return{
                username:'',
                password:'', 
                browserCheck:false,
                rules: [
                    v => !!v || 'This field is required',
                ],
            }
        },
        created(){

            // var nVer = window.navigator.appVersion;
            var nAgt = window.navigator.userAgent;
            var browserName  = window.navigator.appName;
            var fullVersion  = ''+parseFloat(window.navigator.appVersion); 
            var majorVersion = parseInt(window.navigator.appVersion,10);
            var nameOffset,verOffset,ix;

            // In Opera, the true version is after "Opera" or after "Version"
            if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
             browserName = "Opera";
             fullVersion = nAgt.substring(verOffset+6);
             if ((verOffset=nAgt.indexOf("Version"))!=-1) 
               fullVersion = nAgt.substring(verOffset+8);
            }
            // In MSIE, the true version is after "MSIE" in userAgent
            else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
             browserName = "Microsoft Internet Explorer";
             fullVersion = nAgt.substring(verOffset+5);
            }
            // In Chrome, the true version is after "Chrome" 
            else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
             browserName = "Chrome";
             fullVersion = nAgt.substring(verOffset+7);
            }
            // In Safari, the true version is after "Safari" or after "Version" 
            else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
             browserName = "Safari";
             fullVersion = nAgt.substring(verOffset+7);
             if ((verOffset=nAgt.indexOf("Version"))!=-1) 
               fullVersion = nAgt.substring(verOffset+8);
            }
            // In Firefox, the true version is after "Firefox" 
            else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
             browserName = "Firefox";
             fullVersion = nAgt.substring(verOffset+8);
            }
            // In most other browsers, "name/version" is at the end of userAgent 
            else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
                      (verOffset=nAgt.lastIndexOf('/')) ) 
            {
             browserName = nAgt.substring(nameOffset,verOffset);
             fullVersion = nAgt.substring(verOffset+1);
             if (browserName.toLowerCase()==browserName.toUpperCase()) {
              browserName = window.navigator.appName;
             }
            }
            // trim the fullVersion string at semicolon/space if present
            if ((ix=fullVersion.indexOf(";"))!=-1)
               fullVersion=fullVersion.substring(0,ix);
            if ((ix=fullVersion.indexOf(" "))!=-1)
               fullVersion=fullVersion.substring(0,ix);

            majorVersion = parseInt(''+fullVersion,10);
            if (isNaN(majorVersion)) {
             fullVersion  = ''+parseFloat(window.navigator.appVersion); 
             majorVersion = parseInt(window.navigator.appVersion,10);
            }

            console.log(''
             +'Browser name  = '+browserName+'<br>'
             +'Full version  = '+fullVersion+'<br>'
             +'Major version = '+majorVersion+'<br>'
             +'navigator.appName = '+navigator.appName+'<br>'
             +'navigator.userAgent = '+navigator.userAgent+'<br>'
            )

            if(!(browserName == "Chrome" && majorVersion >= 79))
            {
                this.browserCheck = false
            }
            else
            {
                this.browserCheck = true
            }
            this.checkLoggedIn()
        },
        computed:{
            ...mapState({
                auth:state => state.auth,
                loading:state=>state.loading,
                user:state=>state.userLoggedIn
            })
        },
        methods:{
            ...mapActions([
                'setLogin'
            ]),
            ...mapMutations(['setLoading']),
            login(){
                if(this.$refs.form.validate()){
                    this.setLogin({username:this.username,password:this.password})
                }
            },
            checkLoggedIn(){
                if(this.user){
                    this.$router.push({name:'dashboard'})
                }else{
                    this.setLoading(false)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
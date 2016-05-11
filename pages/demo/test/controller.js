/**
 * Created by Administrator on 2016/5/7.
 */
define(['vue','validate'],function(Vue){
    var vm = new Vue({
        el:"#app",
        data:{
            a:1
        },
        methods:{
            initialize:function(){
                $("#app").show();

            }

        }

    });


    vm.initialize();
});
define(['vue','validate','css!validateCss'],function(Vue){
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

    $("#form1").mvalidate({});

    vm.initialize();
});
define(['vue','zeptoValidate','css!./template'],function(Vue){
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
    //表单调用方式 校验成功执行success函数
    $("form").Validate({
        success:function(){
            alert(1);
        }
    });

    $("form a").on("click",function(){
        $("form a").removeClass("active");
        $(this).addClass("active")
    });
    $(".check").on("click",function(){
        $(".check").removeClass("active");
        $(this).addClass("active")
    });
    vm.initialize();
});
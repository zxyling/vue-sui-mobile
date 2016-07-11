/**
 * Created by zhangxiaoyang on 2016/6/26.
 * [表单验证插件]此插件由于使用了html5表单验证接口，所以不兼容低版本浏览器
 * 此插件目前需结合SUI使用
 * 需依赖zepto库
 * 调用方式
 * $(选择器).Validate{
 *     success:callback //回调函数,表单验证成功之后调用
 * }
 */
define(['zepto'],function(){
    /**
     * [rules 验证规则对象]
     * 参数：msg为验证为空时候的提示
     * error:正则匹配失败之后的提示
     */
    var rules = {
        name:{
            rule: /^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,50}$/,
            msg:"姓名不能不能为空",
            error:"请输入正确格式的姓名"
        },
        email:{
            rule:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            msg:"邮箱不能为空",
            error:"请输入正确格式的邮箱"
        },
        mobile:{
            rule: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            msg:"请输入手机号",
            error:"请输入正确格式的手机号"
        },
        qq:{
            rule: /^[1-9][0-9]{4,10}$/,
            msg:"QQ号不能为空",
            error:"请输入正确格式的QQ号"
        },
        password:{
            rule:/^[a-z0-9]{6,14}$/,
            msg:"密码不能为空",
            error:"密码格式不正确"
        },
        all:{
            rule:/^0?1[3|4|5|7|8][0-9]\d{8,9}|(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            msg:"账号不能为空",
            error:"请输入正确格式的手机号或邮箱"
        }
    };
    /**
     *过滤验证元素条件
     * */
    var ruleObj = ["input[data-rules],select[data-rules],textarea[data-rules],a[data-rules],span[data-rules]"];
    /**
     * [Validate 插件验证主体]
     * @param {[type]} options [description]
     */
    $.fn.Validate = function(options){
        var dft = {
            cpBy:"zhangxiaoyang",       //插件作者
            rule:"",                    //验证规则
            msg:"内容不能为空",         //默认为空时的提示语
            error:"",                   //内容错误提示语
            success:""                  //表单验证成功执行的函数
        };
        var options = $.extend(dft, options);
        this.each(function(){
            var form  = $(this);
            //获取需要手机的验证对象
            var inputs = form.find(ruleObj.join(''));
            
            inputs.each(function(){
                //当前验证对象
                var _this = $(this);
                //为验证对象添加状态值 1：未通过校验(必填情况下) 2:已通过校验 此处添加默认状态 3:未通过校验
                _this.attr("data-formStatus","1");
                //分割验证规则
                //arr为验证规则数组
                var arr = _this.attr("data-rules").split("|");

                for(var attr in arr){
                    //判断规则
                    switch(arr[attr]){
                        case "required":
                            setRules.apply(_this,["required"]);
                            break;
                        case "name":
                            setRules.apply(_this,["name",rules.name.rule,rules.name.msg,rules.name.error]);
                            break;
                        case "password":
                            setRules.apply(_this,["password",rules.password.rule,rules.password.msg,rules.password.error]);
                            break;
                        case "mobile":
                            setRules.apply(_this,["mobile",rules.mobile.rule,rules.mobile.msg,rules.mobile.error]);
                            break;
                        case "qq":
                            setRules.apply(_this,["qq",rules.qq.rule,rules.qq.msg,rules.qq.error]);
                            break;
                        case "email":
                            setRules.apply(_this,["email",rules.email.rule,rules.email.msg,rules.email.error]);
                            break;
                        case "all":
                            setRules.apply(_this,["all",rules.all.rule,rules.all.msg,rules.all.error]);
                            break;
                            
                    }
                }
            });
            /**
             * [表单提交]
             * @param onOff判断是否全部通过验证触发器
             */
            form.submit(function(){
                //初始化触发器并清空当前页面所有提示
                var onOff = true;
                $(".toast").hide();
                var inputs = form.find(ruleObj.join(''));

                inputs.each(function(){
                    var _this = $(this);
                    var reqired = _this.attr("data-required");
                    var value =$.trim(_this.val());
                    //非必填为空时
                    if(reqired == 1&& value == ""){
                        _this.attr("data-formStatus","2");
                    }
                    //验证未通过
                    if(_this.attr("data-formStatus")=="1"){
                        if(_this.attr("type")){
                            var type = _this.attr("type").toLowerCase();
                        }
                        var names = _this[0].nodeName.toLowerCase();
                        //非文本框校验
                        if(type == "radio"||type == "checkbox"||names == "a"||names =="span"){
                            $.toast(_this.attr("data-msg"));
                        }
                        else{
                            //只针对文本输入框
                            if($.trim(_this.val())==""){
                                $.toast(_this.attr("data-msg"));
                            }else{
                                $.toast(_this.attr("data-error"));
                            }
                        }
                        onOff = false;
                        return false;
                    }
                });
                if(onOff){
                    options.success();
                }
                return false;
            });
            
        });
    };
    //判断自定义验证方法
    function otherFn(types,events){
        var name = this.attr("name");
        var lists = $(types+"[name='"+name+"']");
        lists.on(events,function(){
            lists.attr("data-formStatus",2);
        });
    }
    /**
     * [正则验证封装]
     * @param rele 正则
     * @param msg  为空提示信息
     * @param error 验证错误提示信息
     * */
    function checkRules(rule,msg,error){
        var _this = this;
        var reqired = _this.attr("data-required");
        var value = "",              //验证内容
            pass = false;           //正则验证返回值
        this.on("input",function(){
            value = $.trim(_this.val());
            pass = rule.test(value);
            if(pass == true){
                console.log("错误");
                _this.attr("data-formStatus","2");
                $(".toast").hide();
            }else{
                console.log("正确");
                _this.attr("data-formStatus","1");
                if($.trim(value)==""&&reqired == 2){
                    if($(".toast").length>1){

                    }else{
                        $(".toast").remove();
                        $.toast(msg);
                    }
                }else{
                    if($(".toast").length>=1){

                    }else{
                        $.toast(error);
                    }
                }
            }
        });
    }
    /**
     * [setRules 添加表单验证规则]
     * @param {[type]} name  [验证参数名]
     * @param {[type]} rule  [验证正则]
     * @param {[type]} msg   [非空校验提示语]
     * @param {[type]} error [正则验证失败提示语]
     */
    function setRules(name,rule,msg,error){
        var _this = this;
        //初始化data-required属性 必填属性为值 2 非必填 1
        if(_this.attr("data-required") === null){
            console.log(_this.attr("data-required"));
            _this.attr("data-required","1");
        }
        if( name == "required"){
            _this.attr("data-required","2");
            //设置name属性用来判断特定自定义表现选择情况
            this.attr(name,name);
            //获取对象type属性
            if(this.attr("type")){
                var type = this.attr("type").toLowerCase();
            }
            //无type属性对象获取nodeName
            var names = _this[0].nodeName.toLowerCase();
            //判断对象类型进行验证操作
            if(type == "text") {
                var length = _this.attr("data-rules").split("|").length;
                if(length<=1 && _this.attr("data-rules") == 'required'){
                    _this.on("input",function () {
                        var value="";
                        value = $.trim(_this.val());
                        if(value == ""){
                            _this.attr("data-formStatus","1");
                        }else{
                            _this.attr("data-formStatus","2");
                        }
                    });
                }
            }
            if(type == "textarea") {
                //多行文本输入框
                this.on("keyup",function(){
                    if($.trim(_this.val())!=""){
                        _this.attr("data-formStatus",2);
                    }else{
                        _this.attr("data-formStatus",1);
                    }
                });
            }
            if(type== "radio"){
                //radio标签
                otherFn.apply(_this,["input","change"]);
            }
            if(type == "checkbox"){
                //checkbox选择框

                otherFn.apply(_this,["input","click"]);
            }
            //当对象为a标签时
            if(names == "a"){
                otherFn.apply(_this,["a","click"]);
            }
            //当对象为span标签时
            if(names == "span"){
                otherFn.apply(_this,["span","click"]);
            }
            if(names.toLowerCase()=="select"){
                this.on('change',function(){
                    if(_this.val()!=""){
                        _this.attr("data-formStatus",2);
                    }else{
                        _this.attr("data-formStatus",1);
                    }
                });
            }
        }else{
            //不是必填进行的操作
            //为输入框添加自定义属性
            // this.attr("pattern",rule);
            if ( name == "name" ){
                var pattern = rules.name.rule;
            }
            if( name == "password"){
                var pattern = rules.password.rule;
            }
            if( name == "all"){
                var pattern = rules.all.rule;
            }
            if( name == "mobile"){
                var pattern = rules.mobile.rule;
            }
            if(name == "email"){
                var pattern = rules.email.rule;
            }
            if(name == "qq"){
                var pattern = rules.qq.rule;
            }
            checkRules.apply(this,[pattern,msg,error]);
            this.attr("data-msg",msg);
            this.attr("data-error",error);
        }
    }
});
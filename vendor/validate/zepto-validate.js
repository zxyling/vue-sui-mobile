/**
 * Created by zhangxiaoyang on 2016/5/8.
 * [表单验证插件]此插件由于使用了html5表单验证接口，所以不兼容低版本浏览器
 * 此插件目前需结合SUI使用
 * 需依赖zepto库
 * 调用方式
 * $(选择器).Validate{
 *     success:callback //回调函数,表单验证成功之后调用
 * }
 */
define(['zepto'],function($){
    /**
     * [rules 验证规则对象]
     * 参数：msg为验证为空时候的提示
     * error:正则匹配失败之后的提示
     */
    var rules = {
        name:{
            //rule: "^([\u4e00-\u9fa5]+|^([a-zA-Z]+\s?)+)$",
            msg:"姓名不能不能为空",
            error:"请输入正确格式的姓名"
        },
        mobile:{
            rule: "^0?1[3|4|5|7|8][0-9]\d{8,9}$",
            msg:"请输入手机号",
            error:"请输入正确格式的手机号"
        },
        qq:{
            rule: "^[1-9][0-9]{4,10}$",
            msg:"QQ号不能为空",
            error:"请输入正确格式的QQ号"
        },
        password:{
            rule:"^[a-z0-9]{6,14}$",
            msg:"密码不能为空",
            error:"密码格式不正确"
        },
        email:{
            rule:"\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*",
            msg:"邮箱不能为空",
            error:"邮箱格式不正确"
        }
    };
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
            var form = $(this);
            //获取需要手机的验证对象
            var inputs = form.find(ruleObj.join(''));
            //遍历验证对象
            inputs.each(function(){
                var _this = $(this);
                //为验证对象添加状态值 1：未通过校验 2:已通过校验 此处添加默认状态1
                _this.attr("data-status","1");   
                //分割验证规则
                var arr = _this.attr("data-rules").split("|"); 
                for(var attr in arr){   
                    //判断规则
                    switch(arr[attr]){
                        case "required":
                            setRules.apply(_this,["required"]);
                            break;
                        case "name":
                            //setRules.apply(_this,["name",rules.name.rule,rules.name.msg,rules.name.error]);
                            _this.on("input",function(){
                                var val = _this.val();
                                var r = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/g;
                                if(r.test(val)){
                                    _this.removeClass("invalid").addClass("valid");
                                    _this.attr("data-status",2);
                                }else if($.trim(val)==""){
                                    _this.attr("data-status",1);
                                    if($(".toast").length>=1){

                                    }else{
                                        $(".toast").remove();
                                        $.toast(rules.name.msg,2000,"success-top");
                                    }
                                }else{
                                    _this.removeClass("valid").addClass("invalid");
                                    _this.attr("data-status",1);
                                    if($(".toast").length>=1){

                                    }else{
                                        $(".toast").remove();
                                        $.toast(rules.name.error,2000,"success-top");
                                    }
                                }

                            });
                            _this.on("blur",function(){
                               _this.removeClass("valid").removeClass("invalid");
                            });
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
                $(".toast").remove();

                var inputs = form.find(ruleObj.join(''));

                inputs.each(function(){

                   var _this = $(this);
                   if(_this.attr("data-status")=="1"){
                        if(_this.attr("type")){
                            var type = _this.attr("type").toLowerCase();
                        }
                        var names = _this[0].nodeName.toLowerCase();
                       //非文本框校验
                       if(type == "radio"||type == "checkbox"||names == "a"||names =="span"||names == "select"){
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

    function otherFn(types,events){
        var name = this.attr("name");
        var lists = $(types+"[name='"+name+"']");
        lists.on(events,function(){
            lists.attr("data-status",2);
        });
    }

    /**
     * [setRules 添加表单验证规则]
     * @param {[type]} name  [验证参数名]
     * @param {[type]} rule  [验证正则]
     * @param {[type]} msg   [非空校验提示语]
     * @param {[type]} error [正则验证失败提示语]
     */
    function  setRules(name,rule,msg,error){
        var self = this[0];
        var _this = this;
        //判断是否为必填项
        if(name == "required"){
            this.attr(name,name);

            //获取对象type属性
            if(this.attr("type")){
                var type = this.attr("type").toLowerCase();
            }
            //无type属性对象获取nodeName
            var names = _this[0].nodeName.toLowerCase();
            //判断对象类型进行验证操作
            switch(type){
                //select下拉
                case "select-one":               
                    this.on('change',function(){
                        if($(this).val()!=""){
                            _this.attr("data-status",2);
                        }else{
                            _this.attr("data-status",1);
                        }
                    });
                    break;
                //多行文本输入框
                case "textarea":
                    this.on("keyup",function(){
                       if($.trim($(this).val())!=""){
                           _this.attr("data-status",2);
                       }else{
                           _this.attr("data-status",1);
                       }
                    });
                    break;
                //radio标签
                case "radio":
                    otherFn.apply(_this,["input","change"]);
                    break;
                //checkbox选择框
                case "checkbox":
                    otherFn.apply(_this,["input","click"]);
                    break;
            }
            //当对象为a标签时
            if(names == "a"){
                otherFn.apply(_this,["a","click"]);
            }
            //当对象为span标签时
            if(names == "span"){
                otherFn.apply(_this,["span","click"]);
            }
            if(names == "input"){
               _this.on("input",function(){
                    if($.trim($(this).val())==""){
                        _this.attr("data-status",1);
                    }else{
                        _this.attr("data-status",2);
                    }
                });
                _this.on("click",function(){
                    if($.trim($(this).val())==""){
                        _this.attr("data-status",1);
                    }else{
                        _this.attr("data-status",2);
                    }
                });


            }

        }else{
            //不是必填进行的操作
            //为输入框添加自定义属性
            this.attr("pattern",rule);
            this.attr("data-msg",msg);
            this.attr("data-error",error);
            this.on('input',function(){
                var v = this.validity;

                if(true === v.valueMissing){
                    _this.attr("data-status","1");
                    $.toast(msg,2000,"success-top");
                    self.setCustomValidity("");

                }else{

                    if(v.patternMismatch === true){

                        _this.attr("data-status","1");
                        if($(".toast").length>=1){

                        }else{
                            $.toast(error,2000,"success-top");
                            self.setCustomValidity("");
                        }
                    }else {
                        _this.attr("data-status","2");
                        self.setCustomValidity("");
                    }
                }
            });
        }
    }
});
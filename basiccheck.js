// +----------------------------------------------------------------------+
// | BasicCheck.js   简易表单验证
// +----------------------------------------------------------------------+
// | Author: oneboys
// +----------------------------------------------------------------------+
// | Site: www.cssass.com
// +----------------------------------------------------------------------+
function BasicCheck(o, addition){
	if(!o) return false;
	var self = this;
	this.formNode = o;
	this.items = $tag("*[needcheck]",o);
	events.addEvent(this.items, "blur", function(){
		self.bindCheck(this);
	});
	o.onsubmit = function(){
		var ok = true;
		for(var i in self.items){
			if (!self.items.hasOwnProperty(i)) continue;
			ok = self.bindCheck(self.items[i]) && ok;
		}
		if(addition) ok = addition() && ok;
		if(!ok) return false;
	};
};
BasicCheck.prototype = {
	bindCheck : function(o){
		if($class("errorTip",o.parentNode).length > 0){
			$class("errorTip",o.parentNode)[0].innerHTML = "";
		};
		this.realValue = o.value.replace(/(^\s*)|(\s*$)/g, "");
		var ok = true;
		var allowNull = o.getAttribute("allownull");
		if(allowNull == null){
			ok = this.ckeckNull(o); //验证空
			if(!ok) return false;
		}
		var checkLength = o.getAttribute("limit");
		if(checkLength){
			var range = checkLength.split(",");
			ok = this.checkLength(o,range);  //验证长度
			if(!ok) return false;
		};
		var checkReg = o.getAttribute("reg"); //验证正则
		if(checkReg){
			var regexp = new RegExp(/checkReg/);
			ok = this.checkReg(o,checkReg);
			if(!ok) return false;
		}
		var watchnodeName = o.getAttribute("watchnode"); //验证一致性
		if(watchnodeName){
			var node = $tag("*[name="+watchnodeName+"]")[0];
			ok = this.checkUnity(o,node);
			if(!ok) return false;
		}
		return true;
	},
	ckeckNull : function(o){
		if(this.realValue === ""){
			var msg = o.getAttribute("nullmsg") || "不能为空";
			this.warm(o, msg);
			return false;
		}
		return true;
	},
	checkLength : function(o,range){
		var length = this.realValue.length;
		if(length > range[1] || length < range[0]){
			var msg  = o.getAttribute("limitmsg") || "长度限制在"+range[0]+"到"+range[1]+"个字符之间！";
			this.warm(o, msg);
			return false;
		}
		return true;
	},
	checkUnity : function(o, node){
		if(o.value !== node.value){
			var msg  = o.getAttribute("watchmsg");
			this.warm(o, msg);
			return false;
		}
	},
	checkReg : function(o,regexp){
		if(!this.realValue.match(regexp)){
			var msg = o.getAttribute("errormsg");
			this.warm(o, msg);
			return false;
		}
		return true;
	},
	warm : function(o, msg){
		var infoBox = null;
		var nodeid = o.getAttribute("errornode");
		if(nodeid){
			infoBox = $id(nodeid);
			addClass(infoBox, "errorTip");
		}else{
			infoBox = $class("errorTip",o.parentNode);
			if(infoBox.length < 1){
				infoBox = document.createElement("I");
				addClass(infoBox, "errorTip");
				o.parentNode.appendChild(infoBox);
			}else{
				infoBox = infoBox[0];
			}
		}
		infoBox.innerHTML = msg;
	}
};
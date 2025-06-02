setup.tvmodav = {
	"IPX-89": {
		name: "超绝XXX",
		desc: "讲述了一个xxx的故事",
		img: "img/av/1.png",
		content: [
			"一个男人正在亲吻一个女人。",
			"女人呻吟着。",
			"男人与女人一起高潮，女人满足的笑着"
		],
		stat_up: "<<gawareness>><<awareness 5>><<garousal>><<arousal 500>>",
		passtime: 30,
		cost:500,
		type:"口交",
	},
	"HSODA-055":{
		name: "XXXXXX",
		desc: "xxx和xx的故事",
		img: "img/av/2.png",
		content: [
			"<<avnpc 0>>正在亲吻<<avnpc 1>>, <<avhe 0>>将<<avhe 1>>压在身下。",
			"<<avnpc 1>>呻吟着。",
			"<<avnpc 0>>与<<avnpc 1>>一起高潮，<<avhe>>满足的笑着"
		],
		stat_up: "<<gawareness>><<awareness 5>><<garousal>><<arousal 500>>",
		passtime: 30,
		cost:800,
		type:"SM",
		npc:[
			/*
			* name：角色名字
			* status：a:成人，t:儿童
			* pronoun：性别代词，一般与gender一样
			* gender：生理认同性别
			* lvl：体格 1~20，数值越高越健壮
			* */
			{name:"蝙蝠侠", status:"a", pronoun:"m", gender:"m", lvl:15},
			{name:"猫女", status:"t", pronoun:"f", gender:"f", lvl:5},
		]
	}
}

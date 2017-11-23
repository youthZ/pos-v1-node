const data = require('./datbase');
module.exports = function main(inputs) {
	var allItems = data.loadAllItems(); //商品库
	var promotions = data.loadPromotions(); //商品优惠活动
	var countItems = computeCount(inputs,allItems);
	var inputItems = countItemsToInputItems(countItems,allItems);//购物清单根据这个显示
	var text = printShoppingPapers(inputItems,promotions);//打印购物清单
	console.log(text);
//    return text;
};

function computeCount(inputs){
	var res = [];
	for (var index = 0; index < inputs.length ;index++ )
	{
		if(res.length == 0){
			res.push(inputToObject(inputs[index]));
		}else{
			var temp = inputToObject(inputs[index]);
			var indexTemp = 0
			for (; indexTemp < res.length ; indexTemp++)
			{
				if(res[indexTemp].barcode == temp.barcode ){
					res[indexTemp].count += 1;
					break;
				}
			}
			if(indexTemp == res.length){
				res.push(temp);
			}
		}
	}
	return res;
}

function inputToObject(input){
	var object = new Object();
	if(input.indexOf('-') > 0){
		var temp = input.split("-");
		object.barcode = temp[0];
		object.count = parseInt(temp[1]);
	}else{
		object.barcode = input;
		object.count = 1;
	}
	return object;
}

function countItemsToInputItems(countItems,allItems){
	if(countItems.length == 0 || allItems.length == 0){
		return null;
	}else{
		for (var index_count = 0; index_count < countItems.length ; index_count++ )
		{
			for ( var index_all = 0; index_all < allItems.length ; index_all ++)
			{
				if(countItems[index_count].barcode == allItems[index_all].barcode){
					countItems[index_count].name = allItems[index_all].name;
					countItems[index_count].unit = allItems[index_all].unit;
					countItems[index_count].price = allItems[index_all].price;
				}
			}
		}
	}
	return countItems;
}

function printShoppingPapers(inputItems,promotions){
	var contentText =  '***<没钱赚商店>购物清单***\n';
	var proText = '挥泪赠送商品：\n';
	var sum = 0;
	var proSum = 0;
	var barcodes = promotions[0].barcodes;
	//加上1个属性 优惠数量，
	/*
		加属性
	*/
	for (let index=0; index < inputItems.length ; index++)
	{
		let index_p = 0
		for (; index_p < barcodes.length ; index_p++)
		{
			if(inputItems[index].barcode == barcodes[index_p]){
				if(inputItems[index].count > 2){
					inputItems[index].proCount = parseInt(inputItems[index].count / 3);
					break;
				}
			}
		}
		if(index_p == barcodes.length){
			inputItems[index].proCount = 0;
		}
	}

	inputItems.forEach(function(ele){
		sum += (ele.count-ele.proCount)*ele.price;
		contentText = contentText + '名称：'+ele.name+'，数量：'+ele.count+ele.unit+'，单价：'+ele.price.toFixed(2)+'(元)，小计：'+((ele.count-ele.proCount)*ele.price).toFixed(2)+'(元)\n';
		if(ele.proCount > 0){
			proSum += ele.proCount*ele.price;
			proText = proText + '名称：'+ele.name+'，数量：'+ele.proCount+ele.unit+'\n';
		}
	});
	contentText = contentText + '----------------------\n';
	proText = proText + '----------------------\n'+'总计：'+sum.toFixed(2)+'(元)\n'+'节省：'+ proSum.toFixed(2)+'(元)\n'+'**********************';
	return contentText + proText;
}

// 第一步：根据inputs统计标签出现的次数，设定对象的barcode值是条码，count值是出现的数量；最终保存在一个对象数组内
// 第二步：生成购物清单
/*
  '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';
*/

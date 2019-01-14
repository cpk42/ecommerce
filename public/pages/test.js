itemName = [];
itemQty = [];
itemPrice = [];

function addItem(){
	itemName.push(document.getElementById('Name').value);
	itemQty.push(parseInt(document.getElementById('Qty').value));
	itemPrice.push(parseInt(document.getElementById('Price').value));

	displayCart();
}

function displayCart(){

	cartData = "<table><tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Total</th></tr>";
	total = 0;
	for (i=0; i<itemName.length; i++)
	{
		total += itemQty[i] * itemPrice[i]
		cartData += "<tr><td>" + itemName[i] + "</td><td>" + itemQty[i] + "</td><td>" + itemPrice[i] + "</td><td>" + itemQty[i] * itemPrice[i] + "</td><td><button onclick='delElement(" + i + ")'>Delete</button></td></tr>";
	}
	cartData += "<tr><td></td><td></td><td></td><td>" + total + "</td></tr></table>";

	document.getElementById('cart').innerHTML = cartdata;
}

function delElement(a){
	itemName.splice(a, 1);
	itemQty.splice(a, 1);
	itemPrice.splice(a, 1);
	displayCart();
}

// for new order at the bottom
function addOrder (order) {
    const row = createOrderRow(order); //row being built
    document.querySelector('#ordersBody').appendChild(row); // appendChild adds at the end
}



// for updating status by waiter
function updateStatus (orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]')
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    localStorage.setItem('kitchenOrders', JSON.stringify(orders));

    renderOrders();   // re-draw the table with updated status
}



// for deleting order after 5 mins
const FIVE_MIN = 10 * 1000;

//call this whenever status becomes "Done"
function markAsDone(orderId) {
    console.log('markAsDone called for', orderId); 
    const doneTimeStamps = JSON.parse (localStorage.getItem('doneTimeStamps') || '{}');
    doneTimeStamps[orderId] = Date.now();
    localStorage.setItem('doneTimeStamps', JSON.stringify(doneTimeStamps));
}

//checks for orders past their 5 mins mark and deletes them
function checkExpiredOrders() {
    const doneTimeStamps = JSON.parse (localStorage.getItem('doneTimeStamps') || '{}'); 
    const now = Date.now();
    let changed = false;

    for (const orderId in doneTimeStamps) {
        if (now - doneTimeStamps[orderId] >= FIVE_MIN) {
            deleteOrder(orderId);  // your delete function 
            delete doneTimeStamps[orderId];
            changed = true;
        }
    }

    localStorage.setItem('doneTimeStamps', JSON.stringify(doneTimeStamps));
    if (changed) renderOrders ();
} 

//runs once on page load (catches orders that expired while page was closed)
checkExpiredOrders();
//keeps checking every 10 seconds while page stays open
setInterval(checkExpiredOrders, 10000);


function updateStatus (orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]')
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    localStorage.setItem('kitchenOrders', JSON.stringify(orders));

    if (newStatus === 'Done') markAsDone(orderId);
    renderOrders();
}



//Notification for new order
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

//call ths right after the client submits their order
showToast(`☑ Your Order has been sent to the kitchen!`);
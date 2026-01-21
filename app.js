const featureProduct = document.querySelector("#featureProduct");
const cartItems = document.querySelector("#cart-items");
let cartTotal = document.querySelector("#cart-total");
let loadMoreBtn = document.querySelector("#loadMoreBtn");
let cartNotification = document.querySelector("#cartNotification");
const byProduct = document.querySelector("#byProduct");
let cartElement = [], displayDataArr = [];
let dataFromApi;

const toggleCart = () => {
    document.querySelector("#cart-sidebar").classList.toggle("hidden");
}

async function fetchDataFromAPI() {
    const response = await fetch(`https://fakestoreapi.com/products`);
    const dataFromApi = await response.json();
    // console.log("data =>", data)
    return dataFromApi
}

window.onload = async () => {
    dataFromApi = await fetchDataFromAPI();
    displayDataArr = [...dataFromApi.slice(0, 4)]
    displayCard(dataFromApi.slice(0, 4))
}

const displayCard = (displayData) => {
    // console.log(displayData)
    featureProduct.innerHTML = displayData.map(element =>
        `<div class="group border border-transparent hover:border-gray-100 p-2 rounded-xl transition" id="${element.id}">
            <div class="relative bg-gray-100 rounded-lg aspect-square overflow-hidden">
                 <img src="${element.image}" class="w-full h-full object-cover">
                <button onclick="addToCart(${element.id})"
                    class="absolute bottom-4 left-4 right-4 bg-white py-2 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition font-medium shadow-sm">Quick
                    Add +</button>
            </div>
            <div class="mt-4">
                <h3 class="font-bold text-gray-900">${element.title}</h3>
                <p class="text-gray-500 text-sm italic">${element.description.toString().slice(0, 50)}...</p>
                <p class="mt-2 font-bold text-indigo-600">$${element.price}</p>
            </div>
        </div>`
    ).join("")
}

const addToCart = (id) => {
    let flag = true;
    const product = dataFromApi.find(item => item.id === id)
    // console.log(product)
    cartElement.filter(item => {
        if (item.id === product.id) {
            alert("This product is already present")
            flag = false
        }
    })
    if (flag) {
        cartElement.push(product)
        cartNotification.innerHTML = cartElement.length
        cartTotal.textContent = (Number(cartTotal.textContent) + product.price).toFixed(2);
        alert("Product Added Successfully")
        updateCartUI()
        // console.log(cartElement)
    }
}

const updateCartUI = () => {
    cartItems.innerHTML = cartElement.map((item) =>
        `<div class="flex gap-4 items-center py-2 border-b border-slate-100">
            <div class="w-16 h-20 bg-slate-100 flex items-center justify-center rounded">
                <img src="${item.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <h4 class="font-semibold text-gray-900 line-clamp-2">${item.title}</h4>
                    <input type="number" min="1" value="1"
                        class="mt-3 w-20 px-3 py-1.5
                        border border-gray-300 rounded-lg
                        text-center font-medium
                        focus:ring-2 focus:ring-indigo-500
                        focus:outline-none"/>
                <p class="text-sm text-gray-500 mt-1">$${item.price}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-slate-400 hover:text-red-500">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>`
    ).join("")
}

const removeFromCart = (id) => {
    cartElement = cartElement.filter(item => item.id !== id)
    const removeProduct = dataFromApi.find(item => item.id === id)
    cartNotification.innerHTML = cartElement.length
    cartTotal.textContent = (Number(cartTotal.textContent) - removeProduct.price).toFixed(2);
    updateCartUI()
    // console.log("Successfully Removed", cartElement)
}

loadMoreBtn.addEventListener("click", () => {
    loadMoreBtn.textContent = "Loading...."
    setTimeout(async () => {
        dataFromApi = await fetchDataFromAPI();
        displayDataArr = [...displayDataArr, ...dataFromApi.slice(displayDataArr.length, displayDataArr.length + 4)]
        // console.log(displayDataArr)
        displayCard(displayDataArr)
        loadMoreBtn.textContent = "Load More"
        if (displayDataArr.length == 20) {
            loadMoreBtn.classList.add("hidden")
        }
    }, 200)
})

byProduct.addEventListener("click", () => {
    cartElement = []
    cartTotal.textContent = 0;
    cartNotification.innerHTML = 0;
    updateCartUI();
    toggleCart();
    alert("Thanks For Shopping")
})
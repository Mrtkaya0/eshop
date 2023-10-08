// htmlden gelenler
const categoryList = document.querySelector('.categories');
const productsList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const basketBtn = document.querySelector('#basket-btn');
const closeBtn = document.querySelector('#close-btn');
const basketList = document.querySelector('#list');
const totalInfo = document.querySelector('#total');



// html yüklenme alanı izleyicis
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
  });



//! kategori bilgileriini alma
// 1-apiye istek at
// 2-gelen verileri işle
// 3-verileri ekrana bas
// 4-hata oluşursa beni uyar


const baseUrl = 'https://fakestoreapi.com'; //apimizi değişkene atıyalım 

function fetchCategories(){
   fetch(`${baseUrl}/products/categories`)
   .then((response) => response.json())
   .then(renderCategories)
   .catch((err) => alert("hata oluştu"))
}
// ekrana her bir eleman için kart oluşturma
function renderCategories(categories){
    categories.forEach((category) =>{
        // 1-div oluştur
        const categoryDiv = document.createElement('div')
        // 2-divin içine clas ekle
        categoryDiv.classList.add('category');
        // 3-içeriğini belirle
        // içerikte foto ollmadığıiçin random ile fotoğrafların döndürp yazdırdık
        const randomNum = Math.round(Math.random() * 1000);
        //kendimiz fotoğraf atadık
        categoryDiv.innerHTML=`
        <img src="https://picsum.photos/300/300?r=${randomNum}"/>
        <h2>${category}</h2>
        `;
        // 4-hmtl ekranına gönderme
    categoryList.appendChild(categoryDiv)
    })

}
let data;  //global olarak tanımladık heryerde kullanabilmek için
// ürünlerin verisini çeken fonksiyon
async function fetchProducts() {
// async hata görme zelliği olmadığı için try-catch içinde kullanıp
//hata bulma özelliği kazandrımış oluyoruz 
    try{
          // api istek at 
    const response = await fetch(`${baseUrl}/products`);
    // gelen cevabı işle
    data = await response.json();
    renderProducts(data);
}catch (err) {
    alert('hata oluştu')

}
    }

    // ürünleri ekrana bas

    function renderProducts(products) {
      const cardsHTML = products
      .map (
        (product) => `
        <div class="card">
        <div class="img-wrapper">
        <img src="${product.image}">
        </div>
        <h4>${product.title}</h4>
        <h4>${product.category}</h4>
        <div class="info">
            <span>${product.price}$</span>
            <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
        </div>
    </div>
    `
    )
    .join('');
      
    // hazırlanan html cardı ekrana basma 
    productsList.innerHTML = cardsHTML;

      }

    //!   sepet işlemleri

    let basket = [];
    let total = 0 ;

    basketBtn.addEventListener('click', () => {
        modal.classList.add('active');
        renderBasket();
        
        calculateTotal();
      });
      
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      function addToBasket (id){

        // idsinden yola çıkarak objenin deeğrlerini bulmak
        const product = data.find((i) => i.id === id)

        // sepette ürün daha önce varsa bul
        const found = basket.find((i) => i.id == id);
        if(found){
            // ürün varsa miktarı artır
            found.amount++;
        }else{
            // sepette ürün yoksa ekle 
            basket.push({...product, amount: 1});
        }
    

      }

      function renderBasket (){
        basketList.innerHTML = basket.map((item) =>
    
        `
        <div class="item">
        <img src="${item.image}">
        <h3 class="title">t${item.title.slice(0,20)+'...'}"</h3>
        <h4 class="price">$ ${item.price}</h4>
        <p>Adet:${item.amount}</p>
        <img onclick="handleDelete(${item.id})" id="delete-img" src="images/e-trash.png" >
    </div>
        `) 
        .join('');

      }

    //   toplam ürünün sayı ve fiyatını hesapla 
    function calculateTotal(){
        // reduce diziyi dönüp belirlenen elemanları toplar
    
        const total = basket.reduce(
            (sum,i) => sum+i.price * i.amount,0
        );

        // toplam miktar hesplama

        const amount = basket.reduce((sum,i) => sum + i.amount,0)

        totalInfo.innerHTML = `
        
        
         <span id="count">${amount}</span>
          Toplam:
          <span id="price">${total.toFixed(2)}</span>$
        `
    }

    // elemanı siler

    function handleDelete (deleteId) {
        // kaldırılan ürünü diziden çıkarma
        basket = basket.filter((i) => i.id !==deleteId);
        // listeyi güncelle
        renderBasket();
        // toplamı güncelle
        calculateTotal();
    
    }
    
    
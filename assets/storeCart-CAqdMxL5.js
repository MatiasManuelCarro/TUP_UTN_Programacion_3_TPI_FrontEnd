import{i as f,j as p,f as I,r as S,g as h,l as k,a as B,b as C,k as g,h as $,m as T,c as q}from"./categoriesUtils-R8yU8TrM.js";const M=600;function b(){return M}function E(){const e=localStorage.getItem("orders");return e?JSON.parse(e):[]}function O(e){const n=[...E(),e];localStorage.setItem("orders",JSON.stringify(n))}function D(){const e=E();return e.length===0?1:Math.max(...e.map(t=>t.id))+1}const u=()=>{const e=document.getElementById("cart-container"),t=document.getElementById("cart-message");e.innerHTML="";const n=p(),a=B(),m=C().filter(r=>!r.eliminado);let o=0;for(const r of n){const d=a.find(i=>i.id===r.product.id);if(!d||!d.disponible){g(r.product);continue}if(!d.categorias.some(i=>m.some(L=>L.id===i.id))){g(r.product);continue}const c=P(r);e.appendChild(c),N(c,r.product,r.quantity),o+=r.product.precio*r.quantity}y(n,t),x(),H(o),U()};function y(e,t){e.length===0?t.innerHTML="No hay ningún producto en el carrito.":t.innerHTML=`
    <span class="cart-message-box">Total de productos en el carrito:
    <span class="cart-count">${$()}</span></span>
    `,t.style.display="block"}function P(e){const{product:t,quantity:n}=e,a=t.precio*n,s=document.createElement("article");return s.classList.add("cart-products"),s.innerHTML=`
    <div class="cart-img">
    <img src="${t.imagen}" alt="Imagen de ${t.nombre}" />
    </div>
    <h3 class="cart-name">${t.nombre}</h3>
    <p class="cart-description">${t.descripcion}</p>
    <p class="cart-price">Precio: $${t.precio}</p>
    <p class="cart-amount">
    <a href="#" class="link-amount minus" data-id="${t.id}">-</a>
    Cantidad: ${n}
    <a href="#" class="link-amount plus" data-id="${t.id}">+</a>
    </p>
    <p class="cart-subtotal">Subtotal: $${a}</p>
    <div class="buttons">
    <button class="btn-cart delete" data-id="${t.id}">Eliminar</button>
    </div>`,s}function H(e){const t=document.querySelector(".cart-summary h3");if(t){let n=0;const a=b();e===0?(n=0,t.innerHTML=`
            <p><strong>Total: $${n}</strong></p>
        `):(n=e+a,t.innerHTML=`
            <p>Subtotal: $${e}</p>
            <p>Envío: $${a}</p>
            <p><strong>Total: $${n}</strong></p>
        `)}}function N(e,t,n){const a=e.querySelector(".link-amount.minus"),s=e.querySelector(".link-amount.plus"),m=e.querySelector(".btn-cart.delete");n>=t.stock?(s.style.color="var(--color-borde)",s.style.cursor="default"):n===1&&(a.style.color="var(--color-borde)",a.style.cursor="default"),a.addEventListener("click",o=>{o.preventDefault(),n>1&&(T(t),u())}),s.addEventListener("click",o=>{o.preventDefault(),n<t.stock&&(q(t,1),u())}),m.addEventListener("click",()=>{g(t),u();const o=p(),r=document.getElementById("cart-message");y(o,r)})}document.addEventListener("DOMContentLoaded",()=>{u()});document.getElementById("clear-cart")?.addEventListener("click",()=>{f(),u();const e=document.getElementById("cart-message");y([],e)});const l=document.getElementById("buy-button");function U(){p().length>0?(l.disabled=!1,l.classList.remove("btn-disabled"),l.classList.add("btn-cart")):(l.disabled=!0,l.classList.remove("btn-cart"),l.classList.add("btn-disabled"))}document.getElementById("buy-button").addEventListener("click",w);function w(){const e=p(),t=document.getElementById("checkout-phone").value,n=document.getElementById("checkout-payment").value;if(!t||!n){alert("Debe completar teléfono y forma de pago.");return}const a=e.reduce((c,i)=>c+i.product.precio*i.quantity,0),s=b(),m=a+s,o=I();if(!o){alert("No hay usuario autenticado.");return}const r={id:D(),fecha:new Date().toISOString().split("T")[0],estado:"PENDIENTE",total:m,formaPago:n,detalles:e.map(c=>({cantidad:c.quantity,subtotal:c.product.precio*c.quantity,producto:c.product})),usuarioDto:{id:o.id,nombre:o.nombre,apellido:o.apellido,mail:o.mail,celular:t,rol:o.rol}};e.forEach(c=>{S(c.product.id,c.quantity)}),O(r),f(),u();const d=document.getElementById("order-modal");d.classList.remove("hidden"),document.getElementById("close-order-modal").addEventListener("click",()=>{d.classList.add("hidden")})}function x(){const e=p(),t=document.getElementById("cart-summary");e.length>0?t.style.display="block":t.style.display="none"}const A=document.getElementById("loader");h("USUARIO")&&document.addEventListener("DOMContentLoaded",()=>{A.classList.add("hidden");const e=document.getElementById("menu-toggle"),t=document.querySelector(".sidebar");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("active")});const n=document.getElementById("logout-btn");n&&n.addEventListener("click",a=>{a.preventDefault(),k()})});

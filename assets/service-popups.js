(()=>{
const descriptions=["Gas, LPG and oil systems provide heating and hot water using different fuel supplies. Mains gas is supplied directly to your property, while LPG and oil are commonly used in homes without a mains gas connection. The right choice depends on your property, existing system and available fuel supply.", "Your boiler provides heat for your central heating and, depending on the system, your hot water. Combi boilers heat water on demand without a separate cylinder. System and conventional boilers work with a hot water cylinder. Choosing the right type and size depends on your home, available space and hot water needs.", "Air-source heat pumps use electricity to transfer heat from the outside air into your home, even in cold weather. An air-to-water system can supply radiators, underfloor heating and a compatible hot water cylinder. Good system design is essential, and running costs depend on your home, electricity tariff and how the system is used.", "A hot water cylinder stores heated water ready for your taps and showers. Different cylinders can work with boilers, heat pumps or electric immersion heaters. Unvented cylinders are supplied directly from the mains, with performance depending on the incoming water supply. The right cylinder size depends on your household\u2019s hot water demand.", "Central heating distributes warmth around your home through radiators or underfloor heating. Balanced radiators, suitable controls and clean system water help it work effectively. Over time, sludge and debris can affect circulation. Where appropriate, professional cleaning, such as power-flushing or a magnetic cleaning treatment, can help restore performance.", "Smart heating controls help you manage temperatures and schedules, often through an app on your phone. Depending on the system, features may include remote adjustment, individual room control and automatic scheduling. Compatible controls can help reduce unnecessary heating, with any savings depending on your existing setup and how you use them.", "Air conditioning removes heat from indoor rooms to help maintain a comfortable temperature. Many modern systems can also provide heating, making them useful throughout the year. Options include systems for a single room or several rooms. Correct sizing and positioning help achieve effective temperature control and comfortable airflow.", "Taps and pipework deliver water around your home to kitchens, bathrooms and appliances. Repairs or replacements can address dripping taps, leaks and worn fittings. Choosing components suited to your water pressure and existing plumbing helps ensure reliable operation, while correctly installed fittings help protect your drinking water supply."];
const popup=document.querySelector('.service-popup');
const cards=[...document.querySelectorAll('.feature')];
cards.forEach((card,i)=>{
 if(!descriptions[i])return;
 card.setAttribute('role','button');card.tabIndex=0;
 card.setAttribute('aria-haspopup','dialog');
 card.setAttribute('aria-label','Learn about '+card.querySelector('h3').textContent);
 function open(){
 document.getElementById('service-popup-title').textContent=card.querySelector('h3').textContent;
 document.getElementById('service-popup-copy').textContent=descriptions[i];
 popup.showModal();
 }
 card.addEventListener('click',open);
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
});
popup.addEventListener('click',()=>popup.close());
})();

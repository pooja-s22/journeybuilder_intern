let lines = [];
let previousElement = null;
let selectedCampaignElement = null;

document.getElementById('createCampaignBtn').addEventListener('click', function () {
    previousElement = null; // Reset previous element for the first campaign
    showPopup('selectTypePopup');
});

function showPopup(popupId) {
    document.getElementById('overlay').classList.add('show');
    document.getElementById(popupId).classList.add('show');
}

function hidePopup() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('show');
    });
    document.getElementById('overlay').classList.remove('show');
}

document.getElementById('overlay').addEventListener('click', hidePopup);

function selectCampaignType(type) {
    hidePopup();
    showPopup('inputPopup');
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = '';
    for
 (let i = 1; i <= 10; i++)
 {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Input ${i}`;
    inputContainer.appendChild(input);
}
document.getElementById('submitInputs').onclick = function () {
    createCampaign(type);
};
}

function createCampaign(type) {
hidePopup();
const container = document.getElementById('campaignContainer');
const createdCampaign = document.createElement('div');
createdCampaign.className = `draggable campaign-${type}`;
createdCampaign.innerHTML = `<i class="fas ${getIconClass(type)}"></i> ${capitalizeFirstLetter(type)} Campaign`;

const addButton = document.createElement('button');
addButton.innerHTML = '<i class="fas fa-plus"></i>';
addButton.className = 'add-button';
createdCampaign.appendChild(addButton);

container.appendChild(createdCampaign);

positionElement(createdCampaign);

addButton.addEventListener('click', function () {
    selectedCampaignElement = createdCampaign;
    showPopup('selectDripPopup');
});

addDraggable(createdCampaign);

const line = new LeaderLine(
    document.getElementById('createCampaignBtn'),
    createdCampaign,
    {
        startSocket: 'bottom',
        endSocket: 'top',
        color: '#4CAF50',
        path: 'straight',
        dash: { animation: true }
    }
);
lines.push(line);

previousElement = createdCampaign;

// Load campaigns from JSON and update the created campaign
fetch('campaigns.json')
    .then(response => response.json())
    .then(data => {
        const campaignDetails = data.campaigns.find(campaign => campaign.type === type);
        if (campaignDetails) {
            createdCampaign.innerHTML = `<i class="fas ${getIconClass(type)}"></i> ${capitalizeFirstLetter(type)} Campaign - ${campaignDetails.details}`;
        }
    })
    .catch(error => console.error('Error fetching campaigns:', error));

// Add a "+" button inside the "Create Campaign" button after creating the first campaign
addCreateCampaignPlusButton();
}

document.getElementById('submitDripSelection').addEventListener('click', function () {
hidePopup();
const isEmailDrip = document.getElementById('emailDripCheckbox').checked;
const isSmsDrip = document.getElementById('smsDripCheckbox').checked;
const isWhatsappDrip = document.getElementById('whatsappDripCheckbox').checked;

let dripText = "";
if (isEmailDrip) dripText += " (Email Drip)";
if (isSmsDrip) dripText += " (SMS Drip)";
if (isWhatsappDrip) dripText += " (WhatsApp Drip)";

selectedCampaignElement.querySelector('.drip-text')?.remove(); // Remove any existing drip-text element
const dripTextElement = document.createElement('span');
dripTextElement.className = 'drip-text';
dripTextElement.innerText = dripText;
selectedCampaignElement.appendChild(dripTextElement);

// Clear the checkboxes after selection
document.getElementById('emailDripCheckbox').checked = false;
document.getElementById('smsDripCheckbox').checked = false;
document.getElementById('whatsappDripCheckbox').checked = false;

// Ensure the addButton remains functional
selectedCampaignElement.querySelector('.add-button').addEventListener('click', function () {
    selectedCampaignElement = createdCampaign;
    showPopup('selectDripPopup');
});
});

function getIconClass(type) {
switch (type) {
    case 'email': return 'fa-envelope';
    case 'sms': return 'fa-sms';
    case 'whatsapp': return 'fa-whatsapp';
    default: return '';
}
}

function capitalizeFirstLetter(string) {
return string.charAt(0).toUpperCase() + string.slice(1);
}

function positionElement(element) {
const containerRect = document.getElementById('campaignContainer').getBoundingClientRect();
const elementRect = element.getBoundingClientRect();
element.style.top = `${Math.random() * (containerRect.height - elementRect.height)}px`;
element.style.left = `${Math.random() * (containerRect.width - elementRect.width)}px`;
}

function addDraggable(element) {
element.draggable = true;

element.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', null); // Required for Firefox
    element.classList.add('dragging');
});

element.addEventListener('dragend', function () {
    element.classList.remove('dragging');
    updateLines();
});

document.getElementById('campaignContainer').addEventListener('dragover', function (event) {
    event.preventDefault();
});

document.getElementById('campaignContainer').addEventListener('drop', function (event) {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        dragging.style.top = `${event.clientY - dragging.offsetHeight / 2}px`;
        dragging.style.left = `${event.clientX - dragging.offsetWidth / 2}px`;
        updateLines();
    }
});
}

function updateLines() {
lines.forEach(line => line.position());
}

function addCreateCampaignPlusButton() {
const createCampaignBtn = document.getElementById('createCampaignBtn');
if (!document.getElementById('createCampaignPlusBtn')) {
    const plusButton = document.createElement('button');
    plusButton.id = 'createCampaignPlusBtn';
    plusButton.innerHTML = '<i class="fas fa-plus"></i>';
    plusButton.className = 'add-button';
    plusButton.style.position = 'absolute';
    plusButton.style.right = '10px';
    plusButton.style.top = '10px';
    plusButton.style.zIndex = '10';
    plusButton.addEventListener('click', function (event) {
        event.stopPropagation();
        showPopup('selectTypePopup');
    });
    createCampaignBtn.style.position = 'relative';
    createCampaignBtn.appendChild(plusButton);
}
}

addDraggable(document.getElementById('createCampaignBtn'));

// app.js - lógica principal do app de aprendizagem

let data;
let currentCards = [];
let cardIndex = 0;

// Carrega o conteúdo a partir de content.json e popula a lista de lições
async function loadContent() {
  try {
    const resp = await fetch('content.json');
    data = await resp.json();
    const list = document.getElementById('lessons-list');
    const ul = document.createElement('ul');
    data.lessons.forEach((lesson, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = lesson.title;
      btn.addEventListener('click', () => startLesson(idx));
      li.appendChild(btn);
      ul.appendChild(li);
    });
    list.appendChild(ul);
  } catch (err) {
    console.error('Erro ao carregar conteúdo', err);
  }
}

// Inicia uma lição específica
function startLesson(idx) {
  const lesson = data.lessons[idx];
  // Esconde a lista de lições e mostra o conteúdo da lição
  document.getElementById('lessons-list').style.display = 'none';
  const lessonContent = document.getElementById('lesson-content');
  lessonContent.style.display = 'block';
  currentCards = lesson.cards.map((card, i) => ({ ...card, id: `${idx}-${i}` }));
  cardIndex = 0;
  showNextCard();
}

// Mostra o próximo cartão ou finaliza a lição
function showNextCard() {
  const container = document.getElementById('card-container');
  const controls = document.getElementById('controls');
  container.innerHTML = '';
  if (cardIndex >= currentCards.length) {
    container.innerHTML = '<p>Fim da lição! Revise regularmente para melhorar.</p>';
    controls.style.display = 'none';
    return;
  }
  const card = currentCards[cardIndex];
  const div = document.createElement('div');
  div.className = 'card';
  // Mostra a palavra em japonês, a tradução em português e notas adicionais
  div.innerHTML = `<h3>${card.ja}</h3><p>${card.pt}</p><small>${card.notes || ''}</small>`;
  container.appendChild(div);
  controls.style.display = 'block';
}

// Avalia o cartão como difícil, bom ou fácil e agende a próxima revisão
function rateCard(rating) {
  const card = currentCards[cardIndex];
  const key = 'srs-' + card.id;
  const now = Date.now();
  let record = JSON.parse(localStorage.getItem(key)) || { interval: 0 };
  const day = 24 * 60 * 60 * 1000;
  if (rating === 'easy') {
    // Intervalo aumenta mais quando é fácil
    record.interval = record.interval * 2 + 4 * day;
  } else if (rating === 'good') {
    // Pequeño aumento no intervalo
    record.interval = record.interval + day;
  } else {
    // Difícil: repete em breve
    record.interval = 0;
  }
  record.due = now + record.interval;
  localStorage.setItem(key, JSON.stringify(record));
  cardIndex++;
  showNextCard();
}

// Eventos de clique para as classificações
document.getElementById('hard-btn').addEventListener('click', () => rateCard('hard'));
document.getElementById('good-btn').addEventListener('click', () => rateCard('good'));
document.getElementById('easy-btn').addEventListener('click', () => rateCard('easy'));
// Botão de voltar
document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('lesson-content').style.display = 'none';
  document.getElementById('lessons-list').style.display = 'block';
});

// Inicializa o conteúdo ao carregar a página
loadContent();

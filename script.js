document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const fetchQuestions = async () => {
        const response = await fetch("https://opentdb.com/api.php?amount=9&difficulty=hard");
        const data = await response.json();
        return formatQuestions(data.results);
    };

    const formatQuestions = (rawQuestions) => {
        return rawQuestions.map(q => ({
            ...q,
            choices: shuffle([...q.incorrect_answers, q.correct_answer])
        }));
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const createCard = (question, index) => {
        const card = document.createElement('div');
        card.id = `card${index}`;
        card.className = 'Card';

        const front = document.createElement('div');
        front.className = `flip front color-${index}`;
        front.innerHTML = `
      <div class="question">${he.decode(question.question)}</div>
      <ul class="choices">
        ${question.choices.map(choice => `<li>${he.decode(choice)}</li>`).join('')}
      </ul>
    `;

        const back = document.createElement('div');
        back.className = `flip back color-${index}`;
        back.innerText = he.decode(question.correct_answer);

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('mouseenter', () => {
            front.style.opacity = 0;
            front.style.transform = `perspective(1000px) rotate${index % 2 === 0 ? 'X' : 'Y'}(180deg)`;
            back.style.opacity = 1;
            back.style.transform = `perspective(1000px) rotate${index % 2 === 0 ? 'X' : 'Y'}(360deg)`;
        });

        card.addEventListener('mouseleave', () => {
            front.style.opacity = 1;
            front.style.transform = `perspective(1000px) rotate${index % 2 === 0 ? 'X' : 'Y'}(0deg)`;
            back.style.opacity = 0;
            back.style.transform = `perspective(1000px) rotate${index % 2 === 0 ? 'X' : 'Y'}(180deg)`;
        });

        return card;
    };

    const createResetButton = (setNewQuestions) => {
        const card = document.createElement('div');
        card.className = 'Card';
        card.role = 'button';

        const reset = document.createElement('div');
        reset.className = 'flip reset';
        reset.innerHTML = '<i class="fas fa-sync"></i> Get New Questions';

        reset.addEventListener('click', setNewQuestions);

        card.appendChild(reset);
        return card;
    };

    const setNewQuestions = async () => {
        app.innerHTML = '<div class="loader">Loading</div>';
        const questions = await fetchQuestions();
        app.innerHTML = '<div class="CardsWrapper"></div>';
        const wrapper = app.querySelector('.CardsWrapper');

        questions.forEach((question, index) => {
            wrapper.appendChild(createCard(question, index));
        });

        wrapper.appendChild(createResetButton(setNewQuestions));
    };

    setNewQuestions();
});
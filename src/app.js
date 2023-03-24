const testIndicator = true;

const theKey = (indicator) => {
  const API_KEY = indicator ? 'YOUR_WORDNIK_API_KEY' : '8s3ra3bi8i9glz0gu5bhjsij1kx465tgrwiftovjcg5792b4e';
  return API_KEY;
}

const dummyData = [
  {
    word: 'Example',
    definition: 'A representative form or pattern serving as a basis for imitation or comparison.',
    examples: [
      'This is an example sentence for the word "example".',
      'Her presentation included several examples to illustrate the main points.',
    ],
  },
  {
    word: 'Innovation',
    definition: 'The introduction of something new, such as a method or device.',
    examples: [
      'The company is known for its continuous innovation in the field of technology.',
      'Her innovations in the field of agriculture led to increased crop yields.',
    ],
  },
  {
    word: 'Synergy',
    definition: 'The interaction or cooperation of two or more agents to produce a combined effect greater than the sum of their separate effects.',
    examples: [
      'The synergy between the two companies resulted in a successful merger.',
      'By combining their efforts, the team achieved a synergy that led to success.',
    ],
  },
];

const wordContainer = document.getElementById('word-container');

async function getRandomWords() {
  const newWords = theKey(testIndicator) === 'YOUR_WORDNIK_API_KEY' ? dummyData : await fetchRandomWords(3);

  newWords.forEach(({ word, definition, examples }, index) => {
    const wordDiv = document.getElementById(`word-${index + 1}`);
    const wordTitle = wordDiv.querySelector('.word__title');
    const wordDefinition = wordDiv.querySelector('.word__definition');
    const exampleList = wordDiv.querySelector('.word__example-list');
    const pronounceButton = wordDiv.querySelector('.word__pronounce-button');

    wordTitle.textContent = word;
    wordDefinition.textContent = definition;

    // Clear existing examples before appending new ones
    exampleList.innerHTML = '';
    examples.forEach(example => {
      const listItem = document.createElement('li');
      listItem.textContent = example;
      exampleList.appendChild(listItem);
    });

    pronounceButton.addEventListener('click', () => speak(word));
  });
}

async function fetchRandomWords(count) {
  const words = [];

  try {
    const response = await fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minDictionaryCount=5&maxDictionaryCount=15&limit=${count}&api_key=${theKey(testIndicator)}`);
    const wordsData = await response.json();
    for (let i = 0; i < wordsData.length; i++) {
      const word = wordsData[i].word;
      const definition = await fetchDefinition(word);
      const examples = await fetchExamples(word);
      words.push({ word, definition, examples });
    }
  } catch (error) {
    console.error({ words, error });
  }

  return words;
}

async function fetchDefinition(word) {
  let definition = '';
  try {
    const response = await fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=${theKey(testIndicator)}`);
    const definitions = await response.json();
    definition = definitions[0].text.replace(/<\/?[^>]+(>|$)/g, '');
  } catch (error) {
    console.error({ word, definition, error })

    return definition;
  }
}

async function fetchExamples(word) {
  let examples = [];
  try {
    const response = await fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?limit=3&api_key=${theKey(testIndicator)}`);
    const examplesData = await response.json();
    examples = examplesData.examples.map(example => example.text);
  } catch (error) {
    console.error({ word, examples, error });
  }

  return examples;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

getRandomWords();

const { MongoClient } = require("mongodb");

// Fonction pour récupérer les données JSON localement
async function fetchData() {
  const uri = 'mongodb+srv://silbes:hOKQ9G02i9bnGWm1@cluster0.bu4k3ge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('nom_de_votre_base_de_données');
    const collection = database.collection('nom_de_votre_collection');

    // Récupérer les données
    const data = await collection.find().toArray();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis MongoDB:', error);
  } finally {
    await client.close();
  }
}

// Fonction pour mettre à jour les données JSON avec un nouveau mot et sa note
async function updateData(word, score) {
  try {
    fs.writeFileSync('bdd.json', JSON.stringify(data));
    console.log('Données écrites avec succès dans le fichier JSON');
  } catch (error) {
  console.error('Erreur lors de l\'écriture des données dans le fichier JSON:', error);
  }
  /*
  try {
    const data = await fetchData();
    data[word] = score;
    const response = await fetch('bdd.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log('Données mises à jour avec succès.');
    } else {
      console.error('Erreur lors de la mise à jour des données.');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données JSON:', error);
  }*/
}

// Fonction pour calculer la note totale
function calculateTotalScore(words, data) {
  let totalScore = 0;
  words.forEach(word => {
    totalScore += data[word] || 0;
  });
  return totalScore;
}

// Fonction pour afficher le résultat
function displayResult(totalScore) {
  let backgroundImage;
  let text;
  if (totalScore < 0) {
    backgroundImage = 'moon.jpg';
    text = 'Lunaire';
  } else if (totalScore > 0) {
    backgroundImage = 'sun.jpg';
    text = 'Solaire';
  } else {
    backgroundImage = 'cosmos.jpg';
    text = 'Cosmique';
  }

  // Appliquer les changements d'image avec fondu
  document.body.style.transition = 'background-image 1s ease-in-out';
  document.body.style.backgroundImage = `url(${backgroundImage})`;

  // Afficher le texte avec fondu
  setTimeout(() => {
    document.getElementById('resultText').innerText = text;
    document.getElementById('resultText').style.transition = 'opacity 1s ease-in-out';
    document.getElementById('resultText').style.opacity = 1;
  }, 1000);

  // Disparition progressive après 10 secondes
  setTimeout(() => {
    document.body.style.transition = 'background-image 1s ease-in-out';
    document.body.style.backgroundImage = 'none';
    document.getElementById('resultText').style.transition = 'opacity 1s ease-in-out';
    document.getElementById('resultText').style.opacity = 0;
  }, 10000);
}

// Événement lors du clic sur le bouton "Go"
document.getElementById("submitButton").addEventListener("click", async function() {
  const inputText = document.getElementById("inputText").value;
  const words = inputText.split(' ');

  const data = await fetchData();

  words.forEach(word => {
    if (!data.hasOwnProperty(word)) {
      data[word] = Math.floor(Math.random() * 3) - 1;
      updateData(word, data[word]);
    }
  });

  const totalScore = calculateTotalScore(words, data);
  displayResult(totalScore);
});

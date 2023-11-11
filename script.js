let salesChart;  // Garder une référence au graphique
let data;  // Stocker les données globalement
let ctx;  // Garder une référence au contexte du graphique

document.addEventListener('DOMContentLoaded', function () {
    // Charger les données depuis le fichier JSON (à adapter selon votre structure JSON)
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;  // Stocker les données globalement
            updateChart();  // Appel initial pour afficher le graphique

            // Récupérer toutes les dates de tous les objets
            const dates = data.reduce((allDates, obj) => {
                obj.prices.forEach(entry => {
                    if (!allDates.includes(entry.date)) {
                        allDates.push(entry.date);
                    }
                });
                return allDates;
            }, []);

            // Inverser les axes du graphique
            ctx = document.getElementById('salesChart').getContext('2d');

            // Créer le graphique initial
            createChart(data, dates);
        })
        .catch(error => console.error('Erreur de chargement des données :', error));
});

function createChart(data, dates) {
    // Créer un tableau pour stocker la série de données de l'objet actuellement sélectionné
    var datasets = data.map(obj => {
        return {
            label: obj.name,
            data: obj.prices.map(entry => entry.price),
            borderColor: getRandomColor(),
            borderWidth: 1,
            fill: false
        };
    });

    // Créer le graphique avec les données de tous les objets
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        min: 0,
                        max: 100, // Modifiez selon vos besoins
                        stepSize: 10
                    }
                }
            },
            legend: {
                display: true,
                position: 'top',  // Changez la position de 'top' à 'bottom' pour afficher en bas
                labels: {
                    boxWidth: 20,  // Ajustez la largeur des boîtes des légendes selon vos besoins
                    fontColor: 'black'  // Ajustez la couleur du texte de la légende selon vos besoins
                }
            }
        }
    });
}

function updateChart() {
    const objectNameInput = document.getElementById('objectName');
    const currentObjectName = objectNameInput.value;

    // Filtrer les données pour obtenir les informations de l'objet actuellement sélectionné
    const selectedObject = data.find(obj => obj.name === currentObjectName);

    if (selectedObject) {
        // Vider le graphique actuel
        salesChart.destroy();

        // Créer un nouveau graphique avec les données de l'objet sélectionné
        createChart([selectedObject], selectedObject.prices.map(entry => entry.date));
    } else {
        console.error("L'objet spécifié n'a pas été trouvé dans les données.");
    }
}

function getRandomColor() {
    // Générer une couleur hexadécimale aléatoire
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}



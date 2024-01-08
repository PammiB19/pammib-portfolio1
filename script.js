function uploadAndIdentifyPlantID() {
  // Get the photo from the front end 
  const photoInput = document.getElementById("photoInput");

  // if no photo was selected and the user clicks on submit 
  // alert to the user to upload a photo 
  if (photoInput.files.length === 0) {
    alert("Please select a photo to upload.");
    return;
  }

  // select the first fiel from the files array of an input element
  const selectedFile = photoInput.files[0];

  // create a new file reader object so we can read the contents of the file
  const reader = new FileReader();

  // set up event handler for the onload for the file reader object
  // the onload event is triggered when the reading operation of a file is completed
  reader.onload = function (e) {
    // store the base64image in a variable
    const base64Image = e.target.result;
    console.log('base64Image', base64Image);
    // store variables for the API call 
    const apiKey = 'cFVsKfpVt7DzUieVHUQyLrs7t0n0kuS9OsuirdE52dkUThwo8m';
    const latitude = 49.207;
    const longitude = 16.608;
    const health = 'all';
    const similarImages = true;
    const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause'
    const language = 'en' 
    const apiUrlPlantID = `https://plant.id/api/v3/identification?details=${details}&language=${language}`;

    // Make the first API call with the base64 image
    axios.post(apiUrlPlantID, {
        "images": [base64Image],
        "latitude": latitude,
        "longitude": longitude,
        "health": health,
        "similar_images": similarImages
      }, {
        headers: {
          "Api-Key": apiKey,
          "Content-Type": "application/json"
        }
      })
      // this is the pending state of the promise
      .then(function (response) {
        console.log('Response from Plant ID API:', response.data);
        displayPlantIDInfo(response.data, base64Image)
      })
      // this is the error state of the promise 
      .catch(function (error) {
        alert(`Error: ${error.response.data} ❌❌❌`)
        console.error('Error:', error);
      });
  };

  // Read the selected file as a data URL which is a base64-encoded representation of the file's content
  reader.readAsDataURL(selectedFile);
}

// Display function for the plant ID info
function displayPlantIDInfo(plantIdResponse, base64Image){
  // ======================================
  //  VARIABLE TO STORE THE FIRST SUGGESTION
  // ======================================
  const plantIdClassification = plantIdResponse.result.classification;
  const plantIdDisease = plantIdResponse.result.disease; 
  const plantIdIsHealthy = plantIdResponse.result.is_healthy;
  const plantIdIsPlant = plantIdResponse.result.is_plant;

  // ======================================
  //  PLAN PREVIEW IMAGE
  // ======================================
  // Grab the previewImage image element from the front plantIdentifier.html file 
  const previewImage = document.getElementById('previewImage')
  // set the image HTML src atrribute to the preview image we uploaded on the plantIdentifier.html file 
  previewImage.src = base64Image

  // ======================================
  //  PLANT NAME
  // ======================================
  // grab the HTML for the plant title container
  const plantNameContainer = document.getElementById('plant-name-container');
  // create a new <p> tag element for the plant title 
  const plantNameElement = document.createElement('p');
  // add the name of the plant to the innerHTML of the new <p> tag we created
  plantNameElement.innerHTML = `<strong>Name:</strong> ${plantIdClassification.suggestions[0].name}`
  // append the new div we created to the api result container we grabed from our html
  plantNameContainer.appendChild(plantNameElement);

  // ======================================
  //  SIMILAR IMAGE
  // ======================================
  // Grab the similiar image from the API response 
  const plantSimiliarImage = plantIdClassification.suggestions[0].similar_images[0].url;
  // grab the HTML where the Image will be placed 
  const similiarImageHTML = document.getElementById('plant-similiar-image');
  // set the image HTML src atrribute to the image
  similiarImageHTML.src = plantSimiliarImage;

  // ======================================
  //  PROBABILITY
  // ======================================
  // Grab the probability score from the API response
  const probabilityOfPlant = plantIdClassification.suggestions[0].probability;
  // grab the HTML where the probability will be placed
  const probabilityNameContainer = document.getElementById('probability-container');
  // create a new <p> tag element for the probability text
  const probabilityNameElement = document.createElement('p');
  // add the probability text to the innerHTML of the new <p> tag we created
  probabilityNameElement.innerHTML = `<strong>Probability:</strong> ${probabilityOfPlant}`;
  // append the new div we created to the probabilityNameContainer container we grabed from our html
  probabilityNameContainer.appendChild(probabilityNameElement);

  // ======================================
  //  IS PLANT
  // ======================================
  // grab the is plant boolean value from the API response
  const isPlant = plantIdIsPlant.binary;
  // grab the HTML where the is plant boolean will be placed
  const isPlantContainer = document.getElementById('isPlant-container');
  // create a new <p> tag element for the is plant boolean
  const isPlantElement = document.createElement('p');
  // check to see if the picture the user submitted is not a plant alert the user 
  if (isPlant === false) {
    alert('The picture you submitted is not a plant ❌🪴❌. Please try again!')
    // relaod the page 
    window.location.reload();
  }
  // add the boolean text to the innerHTML of the new <p> tag we created
  isPlantElement.innerHTML = `<strong>Is Plant:</strong> ${isPlant}`;
  // append the new div we created to the isPlantContainer container we grabed from our html
  isPlantContainer.appendChild(isPlantElement);


  // ======================================
  //  COMMON NAME
  // ======================================
  // Grab the first common name from the API response 
  const commonName = plantIdClassification.suggestions[0].details.common_names[0];
  // grab the HTML where the common name will be placed
  const commonNameContainer = document.getElementById('common-name-container');
  // create a new <p> tag element for the probability text
  const commonNameElement = document.createElement('p');
  // add the common name text to the innerHTML of the new <p> tag we created
  commonNameElement.innerHTML = `<strong>Common Name:</strong> ${commonName}`;
  // append the new div we created to the common name container we grabed from our html
  commonNameContainer.appendChild(commonNameElement);

  // ======================================
  //  DESCRIPTION
  // ======================================
  // Grab value from API response
  const plantDescription = plantIdClassification.suggestions[0].details.description.value;
  // Grab container from the front end HTML
  const descriptionContainer = document.getElementById('description-container');
  // create a new <p> tag element
  const descriptionElement = document.createElement('p');
  // add text to the innerHTML of the new <p> tag we created
  descriptionElement.innerHTML = `<strong>Description:</strong> ${plantDescription}`;
  // append the new div we created to the container we grabed from our html
  descriptionContainer.appendChild(descriptionElement);

  // ======================================
  //  PLANT HEALTH STATUS
  // ======================================
  // Grab value from API response
  const plantHealthStatus = plantIdIsHealthy.binary;
  // Grab container from the front end HTML
  const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
  // create a new <p> tag element
  const plantHealthStatusElement = document.createElement('p');
  // add text to the innerHTML of the new <p> tag we created
  plantHealthStatusElement.innerHTML = `<strong>Is Plant Healthy:</strong> ${plantHealthStatus}`;
  // append the new div we created to the container we grabed from our html
  plantHealthStatusContainer.appendChild(plantHealthStatusElement);

  // ======================================
  //  SIMILAR IMAGE WITH DISEASE
  // ======================================
  // Grab the similiar image from the API response 
  const plantSimiliarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
  // grab the HTML where the Image will be placed 
  const similiarImageWithDiseaseHTML = document.getElementById('plant-similiar-image-with-disease');
  // set the image HTML src atrribute to the image
  similiarImageWithDiseaseHTML.src = plantSimiliarImageWithDisease;


  // ======================================
  //  DISEASE NAME
  // ======================================
  // Grab value from API response
  const plantDiseaseName = plantIdDisease.suggestions[0].name;
  // Grab container from the front end HTML
  const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container');
  // create a new <p> tag element
  const plantDiseaseNameElement = document.createElement('p');
  // add text to the innerHTML of the new <p> tag we created
  plantDiseaseNameElement.innerHTML = `<strong>Disease:</strong> ${plantDiseaseName}`;
  // append the new div we created to the container we grabed from our html
  plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

  // ======================================
  //  DISEASE PROBABILITY
  // ======================================
  // Grab value from API response
  const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
  // Grab container from the front end HTML
  const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probabilty');
  // create a new <p> tag element
  const plantDiseaseProbabilityElement = document.createElement('p');
  // add text to the innerHTML of the new <p> tag we created
  plantDiseaseProbabilityElement.innerHTML = `<strong>Disease Probability:</strong> ${plantDiseaseProbability}`
  // append the new div we created to the container we grabed from our html
  plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);

  // ======================================
  //  DISEASE DESCRIPTION
  // ======================================
  // Grab value from API response
  const plantDiseaseDescription = plantIdDisease.suggestions[0].details.description;
  // Grab container from the front end HTML
  const plantDiseaseDescriptionContainer = document.getElementById('plant-disease-description');
  // create a new <p> tag element
  const plantDiseaseDescriptionElement = document.createElement('p');
  // add text to the innerHTML of the new <p> tag we created
  plantDiseaseDescriptionElement.innerHTML = `<strong>Disease Description:</strong> ${plantDiseaseDescription}`;
  // append the new div we created to the container we grabed from our html
  plantDiseaseDescriptionContainer.appendChild(plantDiseaseDescriptionElement);

  // ======================================
  //  DISEASE TREATMENT [👀 SAVE THE BEST FOR LAST USE A LOOP IN THE API FOR TREATMENTS]
  // ======================================
  // Grab value from API response
  const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
  // Grab container from the front end HTML
  const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
  // create a new <p> tag element
  const plantDiseaseTreatmentElement = document.createElement('p');

  // Do a check if the plant is dead and the object is empty we let the user know that there is no treatment avaiable for dead plants
  if (Object.keys(plantDiseaseTreatment).length === 0) {
    // add text to the innerHTML of the new <p> tag we created
    plantDiseaseTreatmentElement.innerHTML = `<strong>Disease Treatment:</strong> No treatment available`;
    // append the new div we created to the container we grabed from our html
    plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
  }

  // loop through the object and map keys to values 
  // then attach them to the HTML container
  for (const key in plantDiseaseTreatment) {
    // if the object has a key value pair
    if (plantDiseaseTreatment.hasOwnProperty(key)) {
      // create a variable and store the value of each key on each iteration
      const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
      // create a variable that mathces the key with the values and wrap them in HTML 
      const plantDiseaseTreatmentText = `<strong>Disease Treatment ${key}:</strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
      // append the text of the key value pairs into the HTML container
      plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
    }
  }

}
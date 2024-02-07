import axios from 'axios';

axios.get('https://api.example.com/data')
    .then(response => {
        console.log(response.data); // Handle the response data
    })
    .catch(error => {
        console.error('There was a problem with the Axios request:', error);
    });

import express from 'express';
import axios from 'axios'

const app = express();

app.get('/', async (req, res) => {
    try {
        const { data } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
        const string = data?.extract;
        const allWords = string.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
        const regex = /^[a-zA-Z]+$/;
        const result = {};
        for (var i = 0; i < allWords.length; i++) {
            if (regex.test(allWords[i])) {
                if (result[allWords[i]]) {
                    result[allWords[i]]++;
                } else {
                    result[allWords[i]] = 1;
                }
            }
        }
        const sortArray = Object.entries(result).sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return a[0].localeCompare(b[0]);
        });
        const newObject = Object.fromEntries(sortArray);
        return res.json({ success: true, sortedListOfWord: newObject })
    } catch (error) {
        console.log(error, "error")
        return res.status(500).send(error)
    }
})

app.listen(8080, () => console.log("Listening on port 8080"))
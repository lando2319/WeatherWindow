require('dotenv').config({ path: __dirname + '/../.env' })
var getCleanError = require("./errorHandling.js");

const { GoogleGenAI, Modality } = require('@google/genai');
const ai = new GoogleGenAI({});


async function grab(query, model) {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: query,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
                numberOfImages: 1
            }
        });

        var imageData;
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageData = part.inlineData.data;
            }
        };

        return imageData
    } catch (err) {
        throw getCleanError.clean(err)
    }
}

module.exports.grab = grab;

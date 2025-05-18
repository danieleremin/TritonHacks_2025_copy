import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const formData = req.body;

            // CSV Header (if the file is empty)
            const filePath = path.join(process.cwd(), 'responses.csv');
            const fileExists = fs.existsSync(filePath);
            let csvString = '';

            if (!fileExists || fs.statSync(filePath).size === 0) {
                csvString += 'TextInput1,TextInput2,Slider1,Slider2,Slider3,Slider4,Checkbox1,Checkbox2\n'; // Add headers
            }

            // CSV Row
            csvString += `${formData.textInput1},${formData.textInput2},${formData.slider1Value},${formData.slider2Value},${formData.slider3Value},${formData.slider4Value},${formData.checkbox1Checked},${formData.checkbox2Checked}\n`;

            fs.appendFileSync(filePath, csvString);

            res.status(200).json({ message: 'Form data saved to CSV' });
        } catch (error) {
            console.error('Error saving form data:', error);
            res.status(500).json({ message: 'Error saving form data' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

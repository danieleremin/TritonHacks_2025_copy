// app/api/formSubmit/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        console.log("Received formData in formSubmit:", formData);

        const filePath = path.join(process.cwd(), 'public', 'responses.csv');
        const fileExists = fs.existsSync(filePath);
        let csvString = '';

        if (!fileExists || fs.statSync(filePath).size === 0) {
            csvString += 'TextInput1,TextInput2,Slider1,Slider2,Slider3,Slider4,Checkbox1,Checkbox2\n';
        }

        csvString += `${formData.textInput1},${formData.textInput2},${formData.slider1Value},${formData.slider2Value},${formData.slider3Value},${formData.slider4Value},${String(formData.checkbox1Checked)},${String(formData.checkbox2Checked)}\n`;

        fs.appendFileSync(filePath, csvString);

        return NextResponse.json({ message: 'Form data written to CSV' }, { status: 200 });
    } catch (error) {
        console.error('Error in formSubmit:', error);
        return NextResponse.json({ message: 'Error processing form' }, { status: 500 });
    }
}

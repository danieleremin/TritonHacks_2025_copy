// [project]/src/app/api/upload/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const config = {
    api: {
        bodyParser: false, // Important for formidable to handle the body
    },
};

const uploadDir = path.join(process.cwd(), 'public', 'img');

export async function POST(req: NextRequest) {
    try {
        await fs.mkdir(uploadDir, { recursive: true });

        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;

        if (!imageFile) {
            return NextResponse.json({ error: 'No image file received.' }, { status: 400 });
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExtension = path.extname(imageFile.name);
        const newFileName = `${uuidv4()}${fileExtension}`;
        const newFilePath = path.join(uploadDir, newFileName);
        const publicFilePath = `/img/${newFileName}`;

        await fs.writeFile(newFilePath, buffer);

        // const output = execSync('python ' + "\"" + process.cwd() + "/public" + publicFilePath + "\"", { encoding: 'utf-8'});
        // console.log(output);
        return NextResponse.json({ message: 'File uploaded successfully.', filePath: publicFilePath }, { status: 200 });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Error uploading file.' }, { status: 500 });
    }
}

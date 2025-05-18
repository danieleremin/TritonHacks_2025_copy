package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strings"
)

func main() {
	fmt.Println("oi")
}



func readFile(file *os.File) string {
	content, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return ""
	}
	return string(content)
}

func csvCreate(){
	// Input and output file names
	txtFilePath := "fireincident.txt" // Replace with your input .txt file path
	csvFilePath := "output.csv"       // Replace with your desired output .csv file path

	// Open the input .txt file
	txtFile, err := os.Open(txtFilePath)
	if err != nil {
		fmt.Println("Error opening .txt file:", err)
		return
	}
	defer txtFile.Close()

	// Create the output .csv file
	csvFile, err := os.Create(csvFilePath)
	if err != nil {
		fmt.Println("Error creating .csv file:", err)
		return
	}
	defer csvFile.Close()

	// Create a CSV writer
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()

	// Read the .txt file line by line
	reader := strings.NewReader(readFile(txtFile))
	csvReader := csv.NewReader(reader)

	// Set the delimiter to '^'
	csvReader.Comma = '^'

	// Read all records from the .txt file
	lines, err := csvReader.ReadAll()
	if err != nil {
		fmt.Println("Error reading .txt data:", err)
		return
	}

	// Write each line to the .csv file, using comma as the delimiter for the output CSV
	for _, line := range lines {
		if err := csvWriter.Write(line); err != nil {
			fmt.Println("Error writing to .csv:", err)
		}
	}

	fmt.Println("Conversion complete. CSV file created:", csvFilePath)
}


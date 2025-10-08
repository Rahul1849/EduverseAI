# NCERT Class XI Physics PDFs

This folder contains sample NCERT Class XI Physics PDFs for testing the application.

## Available PDFs:

1. **Physics Part 1 - Units and Measurements**
   - Covers fundamental concepts of measurement, SI units, precision and accuracy
   - Topics: Physical quantities, units, measurement errors

2. **Physics Part 1 - Motion in a Straight Line** 
   - Covers rectilinear motion, displacement, velocity, acceleration
   - Topics: Position, displacement, velocity, acceleration, equations of motion

3. **Physics Part 2 - Work, Energy and Power**
   - Covers work, kinetic energy, potential energy, power
   - Topics: Work-energy theorem, conservation of energy, power

## Note:
In a production environment, these would be actual PDF files downloaded from the NCERT website. For this demo, the application uses mock text extraction based on the PDF names to simulate the functionality.

## How it works:
1. When a user selects a PDF, the app extracts relevant text content
2. The text is sent to OpenAI API to generate contextual quiz questions
3. Questions are specific to the selected PDF content
4. Progress is tracked per PDF and stored in localStorage

# Quick Setup Instructions

## To get the app running:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env.local
   ```

   Then edit `.env.local` and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## What's Fixed:

✅ **PDF Viewer**: Now shows demo PDF content instead of infinite loading  
✅ **Quiz Generation**: Works with or without OpenAI API key (falls back to mock questions)  
✅ **Progress Tracking**: Saves quiz attempts to localStorage  
✅ **Responsive Design**: Mobile-friendly interface

## Testing the App:

1. **Upload/Select PDF**: Click on any of the sample NCERT PDFs
2. **View PDF**: Switch to "PDF Viewer" tab to see the demo PDF
3. **Generate Quiz**: Switch to "Quiz Generator" tab and click "Generate Questions"
4. **Take Quiz**: Answer the questions and submit
5. **View Progress**: Switch to "Progress" tab to see your performance

## Notes:

- The app works without an OpenAI API key (uses mock questions)
- With an OpenAI API key, it generates real contextual questions
- All progress is saved in your browser's localStorage
- The PDF viewer shows a demo PDF for testing purposes

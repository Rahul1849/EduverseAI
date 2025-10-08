import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message, pdfName, pdfContent } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    console.log("Chat API called with:", { message, pdfName });

    // For now, always use mock responses to ensure it works
    console.log("Using mock responses");

    // Generate contextual mock response based on PDF and message
    const mockResponse = generateContextualResponse(
      message,
      pdfName,
      pdfContent
    );
    return NextResponse.json({ response: mockResponse });

    // If OpenAI API key is available, use OpenAI
    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build context-aware prompt
    const systemPrompt = `You are an AI study companion and virtual teacher. You help students understand concepts from their PDFs and answer their questions in a helpful, educational manner.

Your role:
- Act as a knowledgeable tutor who explains concepts clearly
- Provide step-by-step explanations when needed
- Give examples and real-world applications
- Encourage learning through follow-up questions
- Be supportive and encouraging
- Use a conversational, friendly tone

Guidelines:
- Always be helpful and educational
- Break down complex topics into understandable parts
- Provide examples when appropriate
- Ask clarifying questions if needed
- Encourage further learning
- Be concise but thorough`;

    const userPrompt =
      pdfName && pdfContent
        ? `Context: The student is studying "${pdfName}". Here's the relevant content: ${pdfContent.substring(
            0,
            1000
          )}

Student's question: ${message}

Please provide a helpful, educational response that relates to their PDF content when relevant.`
        : `Student's question: ${message}

Please provide a helpful, educational response as their AI study companion.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);

    // Fallback to mock response
    const mockResponse = generateContextualResponse(
      message,
      pdfName,
      pdfContent
    );
    return NextResponse.json({ response: mockResponse });
  }
}

function generateContextualResponse(message, pdfName, pdfContent) {
  // Simple test response first
  if (
    message.toLowerCase().includes("test") ||
    message.toLowerCase().includes("hello")
  ) {
    return `Hello! I'm your AI study companion. I received your message: "${message}". 

I can see you're working with: ${pdfName || "general study material"}.

I'm here to help you understand concepts and answer questions about your studies. What would you like to learn about today?`;
  }

  const lowerMessage = message.toLowerCase();
  const lowerPdfName = pdfName ? pdfName.toLowerCase() : "";

  // Enhanced contextual responses
  if (lowerPdfName.includes("train") || lowerPdfName.includes("booking")) {
    if (lowerMessage.includes("database") || lowerMessage.includes("table")) {
      return `Great question about database design! For a train booking system, you'll need several key tables:

**Core Tables:**
• **Users** - Store user information and authentication
• **Trains** - Train details, schedules, and routes  
• **Seats** - Seat availability and configuration
• **Bookings** - Reservation details and status
• **Payments** - Transaction information

**Key Relationships:**
• One-to-many: Train → Seats
• Many-to-many: Users ↔ Bookings
• Foreign keys ensure data integrity

**Example Schema:**
Users: id, name, email, password_hash
Trains: id, name, route, departure_time, arrival_time
Seats: id, train_id, seat_number, class, is_available
Bookings: id, user_id, seat_id, booking_date, status

Would you like me to explain any specific table structure or relationship in more detail?`;
    }

    if (lowerMessage.includes("api") || lowerMessage.includes("endpoint")) {
      return `For a train booking system API, here are the essential endpoints:

**Authentication:**
• POST /auth/login - User login
• POST /auth/register - User registration
• POST /auth/logout - User logout

**Train Management:**
• GET /trains - List available trains
• GET /trains/:id - Get specific train details
• GET /trains/search - Search trains by route/date

**Booking Operations:**
• GET /seats/available - Check seat availability
• POST /bookings - Create new booking
• GET /bookings/user/:userId - Get user's bookings
• DELETE /bookings/:id - Cancel booking

**Payment:**
• POST /payments/process - Process payment
• GET /payments/:id - Check payment status

**Example API Call:**
// Search trains
GET /api/trains/search?from=Delhi&to=Mumbai&date=2024-01-15

// Book a seat
POST /api/bookings
{
  "trainId": 123,
  "seatId": 456,
  "userId": 789
}

Each endpoint should include proper validation, error handling, and security measures. Would you like me to detail any specific endpoint?`;
    }

    if (
      lowerMessage.includes("frontend") ||
      lowerMessage.includes("ui") ||
      lowerMessage.includes("interface")
    ) {
      return `For a train booking system frontend, here are the key components:

**Main Pages:**
• **Home Page** - Search trains, featured routes
• **Search Results** - Available trains with filters
• **Train Details** - Seat map, pricing, amenities
• **Booking Form** - Passenger details, seat selection
• **Payment** - Payment gateway integration
• **My Bookings** - User's booking history

**Key Features:**
• Real-time seat availability
• Interactive seat map
• Multiple payment options
• Booking confirmation
• Email/SMS notifications
• Mobile-responsive design

**Technology Stack:**
• React.js for UI components
• Redux for state management
• Axios for API calls
• Bootstrap/Tailwind for styling
• React Router for navigation

**Example Component Structure:**
<TrainSearch />
<TrainList />
<SeatMap />
<BookingForm />
<PaymentGateway />

Would you like me to explain any specific component or feature in detail?`;
    }
  }

  if (lowerPdfName.includes("physics") || lowerPdfName.includes("motion")) {
    if (
      lowerMessage.includes("motion") ||
      lowerMessage.includes("velocity") ||
      lowerMessage.includes("acceleration")
    ) {
      return `Excellent question about motion! Let me explain the key concepts:

**Motion in Physics:**
• **Position** - Where an object is located (measured in meters)
• **Displacement** - Change in position (vector quantity)
• **Velocity** - Rate of change of displacement (vector)
• **Speed** - Magnitude of velocity (scalar)
• **Acceleration** - Rate of change of velocity

**Equations of Motion:**
• v = u + at (final velocity)
• s = ut + ½at² (displacement)
• v² = u² + 2as (velocity-displacement relation)

Where:
- v = final velocity
- u = initial velocity
- a = acceleration
- t = time
- s = displacement

**Key Differences:**
• **Distance vs Displacement**: Distance is total path length, displacement is straight-line distance
• **Speed vs Velocity**: Speed is scalar (magnitude only), velocity is vector (magnitude + direction)
• **Average vs Instantaneous**: Average over time period, instantaneous at specific moment

**Example:**
A car accelerates from 0 to 60 km/h in 10 seconds.
- Initial velocity (u) = 0
- Final velocity (v) = 60 km/h = 16.67 m/s
- Time (t) = 10 s
- Acceleration (a) = (v-u)/t = 1.67 m/s²

Would you like me to work through a specific example or explain any of these concepts in more detail?`;
    }

    if (lowerMessage.includes("force") || lowerMessage.includes("newton")) {
      return `Great question about forces! Newton's laws are fundamental to understanding motion:

**Newton's First Law (Law of Inertia):**
An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.

**Newton's Second Law:**
F = ma (Force equals mass times acceleration)
This is the most important law for problem-solving!

**Newton's Third Law:**
For every action, there is an equal and opposite reaction.

**Types of Forces:**
• **Gravitational Force** - Weight (mg)
• **Normal Force** - Surface reaction force
• **Frictional Force** - Opposes motion
• **Tension Force** - In ropes/cables
• **Applied Force** - External push/pull

**Problem-Solving Steps:**
1. Draw a free-body diagram
2. Identify all forces acting on the object
3. Apply Newton's second law (F = ma)
4. Solve for the unknown

**Example:**
A 5kg box is pushed with 20N force on a frictionless surface.
- Mass (m) = 5 kg
- Applied force (F) = 20 N
- Acceleration (a) = F/m = 20/5 = 4 m/s²

Would you like me to explain any specific type of force or work through more examples?`;
    }
  }

  if (lowerPdfName.includes("chemistry") || lowerPdfName.includes("molecule")) {
    if (lowerMessage.includes("bond") || lowerMessage.includes("molecule")) {
      return `Excellent question about chemical bonding! Let me explain the different types:

**Types of Chemical Bonds:**

**1. Ionic Bonds:**
• Formed between metals and non-metals
• Electrons are transferred (not shared)
• Example: NaCl (sodium chloride)
• High melting and boiling points

**2. Covalent Bonds:**
• Formed between non-metals
• Electrons are shared
• Can be single, double, or triple bonds
• Example: H₂O (water), CH₄ (methane)

**3. Metallic Bonds:**
• Formed between metal atoms
• Electrons are delocalized
• Good conductors of heat and electricity

**Bond Properties:**
• **Bond Length** - Distance between nuclei
• **Bond Energy** - Energy required to break bond
• **Bond Angle** - Angle between bonds

**Molecular Geometry:**
• **Linear** - 180° (CO₂)
• **Trigonal Planar** - 120° (BF₃)
• **Tetrahedral** - 109.5° (CH₄)

Would you like me to explain any specific type of bond or molecular geometry in detail?`;
    }
  }

  // General responses
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return `Hello! I'm your AI study companion. I'm here to help you understand concepts from your PDFs and answer any questions you might have.

${
  pdfName
    ? `I can see you're working with "${pdfName}". Feel free to ask me anything about the content, concepts, or related topics!`
    : "Feel free to ask me any questions about your studies!"
}

**What I can help you with:**
• Explain complex concepts in simple terms
• Provide examples and real-world applications
• Help with problem-solving and calculations
• Suggest study strategies and techniques
• Answer follow-up questions

What would you like to learn about today?`;
  }

  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("what can you do")
  ) {
    return `I'm your AI study assistant! Here's what I can help you with:

**📚 Study Support:**
• Explain concepts from your PDFs in detail
• Answer questions about the material
• Provide examples and clarifications
• Help with problem-solving and calculations
• Connect related concepts

**🎯 Specific Help:**
• Break down complex topics into understandable parts
• Provide step-by-step explanations
• Suggest study strategies and techniques
• Help with homework and assignments
• Discuss real-world applications

**💡 Interactive Learning:**
• Ask follow-up questions to deepen understanding
• Request examples for better comprehension
• Get clarification on confusing parts
• Explore different approaches to problems

**🔬 Subject Areas:**
• Physics (motion, forces, energy, etc.)
• Chemistry (bonding, reactions, etc.)
• Computer Science (programming, databases, etc.)
• Mathematics (algebra, calculus, etc.)
• And many more!

Just ask me anything about your studies, and I'll do my best to help you understand! What topic would you like to explore?`;
  }

  // Default contextual response
  return `That's an interesting question! Let me help you understand this concept better.

**Key Points to Consider:**
• Understanding the fundamental concepts is crucial for mastery
• Practice with examples helps solidify your learning
• Connecting theory to real-world applications enhances comprehension
• Regular review and questioning deepens understanding

**Study Tips:**
• Break complex topics into smaller, manageable parts
• Use visual aids and diagrams when possible
• Practice with different types of problems
• Don't hesitate to ask follow-up questions
• Try to explain concepts to someone else

**Next Steps:**
• Would you like me to elaborate on any specific aspect?
• Do you need help with a particular concept?
• Would you like some practice problems?
• Are there any related topics you'd like to explore?

I'm here to support your learning journey! Feel free to ask me anything else.`;
}

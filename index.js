const express = require("express");
require("dotenv").config();
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messagesArray = [{"role": "user", "content": "Dame respuestas lo más cortas posible pero de una forma natural, sin entrecomillar. \n\nEres un asistente para la reserva de billetes de tren. \nNecesitas rellenar los siguientes datos para completar la reserva:\n1. Número de pasajeros (o número de billetes)\n2. Lugar de ida\n3. Fecha de ida\n4. Lugar de llegada\n5. Fecha de vuelta \n6. Asiento con movilidad reducida\n7. Si tienen descuento.\n\nHaz UNA ÚNICA pregunta por mensaje en el orden dado y ten en cuenta que el usuario te puede dar la información implícita. \n\nUna vez recogida toda esa información, ofrécele diversas opciones, con datos sobre la hora de ida y de vuelta, el precio del ticket en euros y cuánto se tarda, primero para el viaje de ida, y luego para el de vuelta. \n\nUna vez el usuario haya elegido una opción para ida y otra para vuelta, pídele el nombre y el email de los pasajeros incluidos en el viaje. Finalmente, saca por pantalla los datos finales de la reserva y pregúntale si quiere reservar. Finalmente, si decide reservar, dar las gracias por contar con Entretrenes. \n\n"}];
app.post("/chat", async (req, res) => {
  try {
    messagesArray.push({"role": "user", "content": req.body.message});

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesArray,
      temperature: 0,
      max_tokens: 150
    });

    messagesArray.push({"role": "assistant", "content": response.choices[0].message.content});

    response.choices[0].message.content = response.choices[0].message.content.replace(/\n/g, '<br>');
    
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
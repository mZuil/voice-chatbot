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

const prompt = "Dame respuestas lo más cortas posible pero de una forma natural, sin entrecomillar. \n\nEres un asistente para la reserva de billetes de tren. \nNecesitas rellenar los siguientes datos para completar la reserva, en el siguiente orden:\n1. Número de pasajeros (o número de billetes)\n2. Lugar de ida\n3. Fecha de ida\n4. Lugar de llegada\n5. Fecha de vuelta (opcional) \n6. Asiento con movilidad reducida\n7. Si tienen descuento (opcional). Para darte toda esa información, los usuarios pueden decirte expresiones como: 'Quiero dos billetes de Londres a París, del día x al día y', donde dos es el número de pasajeros, Londres el lugar de ida, París el lugar de llegada, x el día para la fecha de ida, e y el día de la fecha de vuelta.\n\n \n\n\nHaz UNA ÚNICA pregunta por mensaje, revisando en el historial de mensajes si el usuario ha dado ya la información de alguna de esas 7 cosas que necesitas rellenar. \n\nUna vez recogida toda esa información, ofrécele diversas opciones, con datos sobre la hora de ida y de vuelta, el precio del ticket y cuánto se tarda. \n\nCuando el usuario elija la opción, pídele el nombre y el email de los pasajeros incluidos en el viaje. \n\nEste es el historial de nuestras conversaciones, y el último mensaje es al que tienes que contestar:\n";

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt + message,
      temperature: 0,
      max_tokens: 150
    });

    console.log("Response from OpenAi: ", response.choices[0].text);

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

// Quiero dos billetes de Madrid a Castellón de la Plana con ida el 17/04 y vuelta el 24/04
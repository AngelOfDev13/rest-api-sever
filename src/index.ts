import { app, port } from "./server";
import colors from 'colors'

app.listen(port, () => {
    console.log( colors.bgBlue.bold(`Hola Mundo desde el puerto ${port}`))
})
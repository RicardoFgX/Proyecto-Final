package com.daw2.proyectoFinal.util;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Clase de utilidad para manejar el log.
 */
public class LogUtil {

    /**
     * Método estático para escribir el mensaje en un archivo de log.
     *
     * @param message Mensaje a escribir en el archivo de log.
     * @param filePath Ruta del archivo de log.
     */
    public static void escribirEnLog(String message, String filePath) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath, true))) {
            writer.println("[" + obtenerHoraActual() + "] " + message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Método privado para obtener la hora actual como cadena de texto.
     *
     * @return Cadena que representa la hora actual.
     */
    private static String obtenerHoraActual() {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date());
    }
}


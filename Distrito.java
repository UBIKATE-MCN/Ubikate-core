import java.util.ArrayList;
import java.util.List;

public class Distrito {
    
    private int idDistrito;
    private String nombre;
    private String cp;
    private List<Double> indicadores = new ArrayList<>();
    private String color4ejes;
    private double puntuacion4ejes;

    
    public double getCalidadAire() {
        return 8.5; 
    }

    public int getZonasVerdes() {
        return 12; 
    }
}
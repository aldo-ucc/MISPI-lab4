package MBeans.beans;

import MBeans.utils.RegistryUtil;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Polygon;
import jakarta.annotation.ManagedBean;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Destroyed;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;
import org.slovenlypolygon.lab3.model.bean.Point;
import org.slovenlypolygon.lab3.model.bean.Points;
import java.util.Comparator;
import java.util.List;

@ManagedBean
@ApplicationScoped
public class Square implements SquareMBean{
    private final Points dataBasePoints = new Points();
    double x = Double.MAX_VALUE; double y = Double.MAX_VALUE;

    public void init(@Observes @Initialized(ApplicationScoped.class) Object unused) {
        RegistryUtil.registerBean(this, "square");
    }

    public void destroy(@Observes @Destroyed(ApplicationScoped.class) Object unused) {
        RegistryUtil.unregisterBean(this);
    }

    @Override
    public double getSquare() {
        List<Point> points = dataBasePoints.getPoints();
        for (Point point: points) {
            if (point.getY()<y || (point.getY()==y && point.getX()<x)) {
                y = point.getY(); x = point.getX();
            }
        }
        points.sort(Comparator.comparing(this::getAngle).thenComparing(this::getLen));

        try {
            GeometryFactory geometryFactory = new GeometryFactory();
            Polygon polygon = geometryFactory.createPolygon(fromPointsToCoordinates(points));
            return polygon.getArea();
        } catch (Exception e) {
            return 0;
        }
    }

    private double getLen(Point point) {
        return Math.sqrt((point.getX()-x)*(point.getX()-x) + (point.getY()-y)*(point.getY()-y));
    }

    private double getAngle(Point point) {
        if (point.getY() == y) return 0;
        if (point.getX() == x) return Math.PI/2;

        double angle = Math.atan((point.getY()-y)/(point.getX()-x));
        if (angle < 0) return Math.PI*2+angle;
        return angle;
    }

    private Coordinate[] fromPointsToCoordinates(List<Point> points) {
        Coordinate[] coordinates = new Coordinate[points.size()+1];
        int i = 0;
        for (Point point: points) {
            coordinates[i] = new Coordinate(point.getX(), point.getY());
            i++;
        }
        coordinates[points.size()] = coordinates[0];
        return coordinates;
    }

}
